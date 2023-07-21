const expressurl = require('express');
const axiosvar = require('axios');
const application = expressurl();
const portno = 8001;
//here we use the listen to get the data i.e url on a particular port pre defined by us
application.listen(portno, () => {
    console.log(`Server is listening to the url request on the portno no ${portno}`);
  });

application.get('/numbers', async (request, responses) => {
  const { url } = request.query;
  if (!url) {
    return responses.status(500).json({ error: 'There is no url parameter given .Enter the url.' });
  }

  const urls = Array.isArray(url) ? url : [url];
  const valid_url_arr = [];

  try {
    // here we validate whether the url is valid or not and then check and validate the response time
    const responses = await Promise.allSettled(
      urls.map(async (udata) => {
        try {
          const starttime= new Date();
          const responsetime = await axiosvar.get(udata);
          const endtime = new Date();
          const responseTime = endtime - starttime;
          //here we validate the response time taken for the url to respond
          if (responseTime < 5000) { // if the response time is greater than 5 secs it does enter the condition but if it is within the 5 seconds range than the valid url is pushed and is accepted
            valid_url_arr.push(udata);
            return responsetime.data;
          }
        } catch (error) {
          console.error(`Error fetching the given url ${udata}: ${error.message}`);
        }
      })
    );

    //here the filtering and storing the unique values
    
    const num = responses.flatMap((response) => response?.value || []).filter(Number.isInteger);//filtering out the non-numeric responses from numeric responses by flattening the responses.

    
    const uniqueno = [...new Set(num)].sort((p, q) => p - q);//sort all the numeric values and remove any duplicates present.To remove the duplicate we use the set dataset.Sort function is used to order the numver in ascending order

    return responses.json({ numbers: uniqueno });
  } catch (error) {
    return responses.status(500).json({ error: ' An error has taken place while processing the url request !!!' });
  }
});


