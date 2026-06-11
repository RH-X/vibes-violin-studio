export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const GET: APIRoute = async ({ url }) => {
  const redirect = (path: string) =>
    new Response(null, { status: 302, headers: { Location: path } });

  const token = url.searchParams.get('token');

  if (!token || token.trim() === '') {
    return redirect('/practice-pals/beta/invalid');
  }

  const { data: signup, error } = await supabase
    .from('beta_signups')
    .select('id, verified, token_expires')
    .eq('token', token)
    .maybeSingle();

  if (error || !signup) {
    return redirect('/practice-pals/beta/invalid');
  }

  if (signup.verified) {
    return redirect('/practice-pals/beta/already');
  }

  if (new Date(signup.token_expires) < new Date()) {
    return redirect('/practice-pals/beta/expired');
  }

  // ── Mark verified, clear token ──
  const { error: updateError } = await supabase
    .from('beta_signups')
    .update({
      verified: true,
      verified_at: new Date().toISOString(),
      token: null,
      token_expires: null,
    })
    .eq('id', signup.id);

  if (updateError) {
    console.error('Supabase update error:', updateError);
    return redirect('/practice-pals/beta/invalid');
  }

  return redirect('/practice-pals/beta/success');
};
