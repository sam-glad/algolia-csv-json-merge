const csv = require('csv-parser')
const fs = require('fs')

const jsonFileContents = fs.readFileSync("restaurants_list.json");
let jsonRestaurants = JSON.parse(jsonFileContents);

fs.createReadStream('restaurants_info.csv')
  .pipe(csv({ separator: ';' }))
    .on('data', csvRestaurant => {
      const matchingRestaurants = jsonRestaurants.filter(restaurant => {
        return restaurant.objectID == csvRestaurant.objectID;
      });

      if (matchingRestaurants.length > 1) {
        throw new Error(`Multiple restaurants found for objectID ${csvRestaurant.objectID}`);
      }
      const jsonRestaurant = matchingRestaurants[0];
      
      jsonRestaurant.foodType = csvRestaurant.food_type;
      jsonRestaurant.starsCount = csvRestaurant.stars_count;
      jsonRestaurant.reviewsCount = csvRestaurant.reviews_count;
      jsonRestaurant.neighborhood = csvRestaurant.neighborhood;
      jsonRestaurant.phoneNumber = csvRestaurant.phone_number;
      jsonRestaurant.priceRange = csvRestaurant.price_range;
      jsonRestaurant.diningStyle = csvRestaurant.dining_style;
    }).on('end', () => {
      prettifiedRestaurants = JSON.stringify(jsonRestaurants, null, 2);
      fs.appendFile(`restaurants_${new Date().getTime()}.json`, prettifiedRestaurants, err => {
        if (err) throw err;
        console.log('New json file with full restaurant info created!');
      });
    });