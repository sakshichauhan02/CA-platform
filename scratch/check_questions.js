const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkQuestions() {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .limit(5);

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Sample Questions:');
    console.log(JSON.stringify(data, null, 2));
  }
}

checkQuestions();
