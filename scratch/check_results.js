const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pkqzjaiabfkdaqzgdggn.supabase.co';
const supabaseKey = 'sb_publishable_Suoe8bpdR4TSsz1V5NJ9EA_uCh-5hte';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkResults() {
  try {
    const { data, error } = await supabase
      .from('test_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Latest Results:');
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error('Catch Error:', err);
  }
}

checkResults();
