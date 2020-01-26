import React from 'react';
import ReactDOM from 'react-dom';
import './css/bootstrap.css';
import './css/index.css';
import noAvailPic from "./pic/image-not-available.png";

/****************************************************************************************************************
Summary: 
1.There are three modules in this app, Home, Search, App.
2.App renders Home or Search through switchMode() function.
3.All the data is fetched through Web API.
4.The fetched random beer is shown in Home.
5.The searched beers' information is shown in Search.
6.I generated a summary for each beer and show it in the webpage.
7.Some images of beers are not provided by the API. Instead, I imported an image named "image-not-available.png"
8.To beautify the layout, I used the css styles provided by Bootstrap.
9.More functions, like searching the description, could be easily implemented if needed.

              By Xiangyu Liu (Andy).       neulxy@gmail.com        26/01/2020
*****************************************************************************************************************/




class Home extends React.Component {

  componentWillMount(){
    this.props.randomBeer();  //Fetch the random beer before loading this component
  }

  render() { //Render the homepage of the app
    return (
      <div>
          <div class="text-center">
            <p class="h2">A Demo of Beer Search Bar Application</p><br/> 
            <p>Implemented by Xiangyu Liu for the technical test of CRS Software</p>
            <button onClick={this.props.switchMode} class="btn btn-primary">Learn about Beer</button>
            <p class="h4">Random Beer for You!!</p>
          </div>
          <div class="middle">{this.props.showRandomBeer()}</div>
      </div>
    );
  }

}

class Search extends React.Component {
  render() {  //Render the search bar webpage
    return (
      <div class="text-center">
          <input class="col-4 rounded" onChange={this.props.handleChange} name="keyword" placeholder="Search for beer..." value={this.props.keyword} />
          <button class="btn btn-primary" onClick={this.props.searchBeer}>Search</button>
          <button class="btn btn-primary" onClick={this.props.switchMode}>Go Back to Home</button>
          <div class="h1 text-center">{this.props.beerCount()} Beers</div>
          <div class="row">{this.props.showResults()}</div>
      </div>
    );
  }
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isHome: true,
      searchBeers:[],  //store all the beer information got from Web API through search bar
      randomBeer:{}, //store the random beer information got from Web API
      keyword: ""
    };
  }


  //Return the count of searched beers
  beerCount = () => {
    return this.state.searchBeers.length;
  }


  handleChange = (event) => {
    this.setState({
        keyword:event.target.value
    });
  }


  // Return Web API Url for fetching data based on different parameters
  // para = "default", return "https://api.punkapi.com/v2/beers/"
  // para = "search", return "https://api.punkapi.com/v2/beers?beer_name="+keyword
  // para = "random", return "https://api.punkapi.com/v2/beers/random"
  apiUrl = (para) => {
    var Url = "";
    switch(para){
        case "default":
            Url = "https://api.punkapi.com/v2/beers/";
            break;
        case "search":
            Url = "https://api.punkapi.com/v2/beers?beer_name=".concat(this.state.keyword);  
            break;
        case "random":
            Url = "https://api.punkapi.com/v2/beers/random";
    }
    return Url;
  }

  //Fetch beer information from Web API with given Url
  //Store beer information into randomBeer when isRandom = true
  getBeers = (Url, isRandom) => {
    fetch(Url)  // Fetch data from Url
    .then(results=>{
       return results.json();  // Get data of Json format
     }).then(data => {  // Map the data into an array of beers, storing the necessary information shown in the webpage
        let beers = data.map((beer) => {
            var briefIntro = beer.description.slice(0,100)+"..."; //Generate a summary of the beer
            return {name: beer.name, description: briefIntro, url: beer.image_url};
        })
        if(isRandom){
          // Store the random beer information into randomBeer
          this.setState({randomBeer:{name: beers[0].name, description: beers[0].description, url: beers[0].url}});
        }
        else
            // Store the searched beer information into searchBeers
            this.setState({searchBeers:beers});  // Store the searched beer information into searchBeers array
     })
  }


  //Search the beers and store them into searchBeers array
  searchBeer = () => {
    var Url = "";
    if(this.state.keyword==="")
        Url = this.apiUrl("default");
    else
        Url = this.apiUrl("search");
    this.getBeers(Url, false);
  }

  //Get the random beer and store it into randomBeer
  randomBeer = () => {
    this.getBeers(this.apiUrl("random"), true);
  }

  //Fetch the searched beers before loading this component
  componentWillMount(){
    this.searchBeer();
  }

  //Return the url of the beer pic
  //If Url is null, return the predefined pic-not-available image
  imgUrl = (Url) => {
    return ((Url?Url:noAvailPic));
  }


  //Show the information of a beer
  showBeer = (beer) => {
    return (
        <div class="media rounded">
           <div class="media-left">
              <img src={this.imgUrl(beer.url)} height="150px"/>
           </div>
           <div class="media-body">
              <div class="h5 text-left">{beer.name}</div>
              <div class="text-left">{beer.description}</div>
           </div>
        </div>
    );
  }

  //Show all the searched beers
  showResults = () => {
    var beers = this.state.searchBeers;
    const rows = beers.map((beer) => {
      return (
        <div class="col-md-4">
          {this.showBeer(beer)};
        </div>
      );
    })
    return rows;
  }


  //Show the random beer
  showRandomBeer = () => {
    return this.showBeer(this.state.randomBeer);
  }

  //Switch between the homepage and search webpage
  switchMode = () => {
    this.setState(state => ({
        isHome: !state.isHome
    }
    ));
  }

  render() {    
    
  if(this.state.isHome){
      return (
          <Home 
               switchMode={this.switchMode}
               randomBeer={this.randomBeer}
               showRandomBeer={this.showRandomBeer}
          />
      );
    }else{
      return(
          <Search
               switchMode={this.switchMode}
               showResults={this.showResults}
               handleChange={this.handleChange}
               keyword={this.state.keyword}
               searchBeer={this.searchBeer}
               beerCount={this.beerCount}
          />
      );
    }
  }
}

// ========================================

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
