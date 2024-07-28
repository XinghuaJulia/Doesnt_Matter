import { supabase } from '../../lib/supabase'


const GenerateTips = async (text) => {
    try {
      const recyclable = await supabase.rpc('generate_text', {description: 'Is ' + text +' generally fit for recycling, answer only using yes or no.'});

      const recyclableStatus = JSON.stringify(recyclable.data.choices[0].message.content);

      console.log(recyclableStatus.toLowerCase() + recyclableStatus.toLowerCase().includes("yes"));

        if (recyclableStatus.toLowerCase().includes("yes")) {
          console.log("item can be recycled");

          const result = await supabase.rpc('generate_text', {description: 'How to clean ' + text + 'so that it is fit for recycling, keep    response under 100 characters.'});

          console.log(result);
          return result.data.choices[0].message.content;
        } else {
            return "Item not even recyclable. Go put yourself into the bin to make the environemtn clean.";
        }
    } catch (error) {
      console.error(error);
      return "";
    }
  };

  export default GenerateTips;