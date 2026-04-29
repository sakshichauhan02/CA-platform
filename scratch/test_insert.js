const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pkqzjaiabfkdaqzgdggn.supabase.co';
const supabaseKey = 'sb_publishable_Suoe8bpdR4TSsz1V5NJ9EA_uCh-5hte';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  try {
    const { data, error } = await supabase
      .from('test_results')
      .insert([
        {
          total_score: 5,
          topic_scores: { "Accounting": 5 },
          test_title: "Manual Test"
        }
      ])
      .select();

    if (error) {
      console.error('Insert Error:', error);
    } else {
      console.log('Insert Success:', data);
    }
  } catch (err) {
    console.error('Catch Error:', err);
  }
}

testInsert();
