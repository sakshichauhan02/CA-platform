const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pkqzjaiabfkdaqzgdggn.supabase.co';
const supabaseKey = 'sb_publishable_Suoe8bpdR4TSsz1V5NJ9EA_uCh-5hte';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  try {
    // We don't provide user_id so it might fail RLS, but we want to check for column existence errors
    const { data, error } = await supabase
      .from('test_results')
      .insert([
        {
          total_score: 5,
          topic_scores: { "Accounting": 5 }
        }
      ]);

    if (error) {
      console.log('Error Code:', error.code);
      console.log('Error Message:', error.message);
    } else {
      console.log('Insert Success (or RLS bypass):', data);
    }
  } catch (err) {
    console.error('Catch Error:', err);
  }
}

testInsert();
