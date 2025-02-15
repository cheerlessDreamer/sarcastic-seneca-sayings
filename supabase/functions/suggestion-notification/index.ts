
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { record } = await req.json()
    
    console.log('Received new suggestion:', record)

    const { data, error } = await resend.emails.send({
      from: 'Seneca Says <onboarding@resend.dev>',
      to: ['YOUR_EMAIL@example.com'], // Replace with your email
      subject: 'New Philosopher Suggestion',
      html: `
        <h1>New Philosopher Suggestion</h1>
        <p><strong>Name:</strong> ${record.name}</p>
        <p><strong>Description:</strong> ${record.description}</p>
        ${record.submitter_email ? `<p><strong>Submitter Email:</strong> ${record.submitter_email}</p>` : ''}
        <p><strong>Submitted at:</strong> ${new Date(record.created_at).toLocaleString()}</p>
      `
    })

    if (error) {
      console.error('Error sending email:', error)
      throw error
    }

    console.log('Email sent successfully:', data)

    return new Response(
      JSON.stringify({ message: 'Email sent successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in webhook handler:', error)
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
