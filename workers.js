addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const path = url.pathname.slice(1) // Remove leading '/'

  if (!path) {
    return new Response('Please input the message as the path of this url...', { status: 400 })
  }

  const groqApiUrl = `https://api.groq.com/openai/v1/chat/completions`
  const groqApiKey = 'Your Groq api here'  // Replace with your actual Groq API key

  const payload = {
    messages: [{ role: 'user', content: path }],
    model: 'llama3-8b-8192'
  }

  try {
    const groqResponse = await fetch(groqApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!groqResponse.ok) {
      return new Response('Error fetching from Groq API', { status: groqResponse.status })
    }

    const groqData = await groqResponse.json()

    // Extract the content from the response
    const content = groqData.choices[0].message.content

    return new Response(content, {
      headers: { 'Content-Type': 'text/plain' },
    })
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 })
  }
}
