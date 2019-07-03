import React, { Component } from 'react';
import './App.scss';

import Container from 'react-bulma-components/lib/components/container';
import Content from 'react-bulma-components/lib/components/content';
import Footer from 'react-bulma-components/lib/components/footer';
import Heading from 'react-bulma-components/lib/components/heading';
import Hero from 'react-bulma-components/lib/components/hero';
import Section from 'react-bulma-components/lib/components/section';

import SearchBar from '../SearchBar/SearchBar';
import SongsList from '../SongsList/SongsList';

const Sentiment = require('sentiment');
const sentiment = new Sentiment();


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      error: "",
      songs: []
    }
  }

  addSong = songObject => {
    let sentimentResult = sentiment.analyze(songObject.lyrics);
    songObject.sentiment = sentimentResult;
    let newSongs = this.state.songs;
    newSongs.unshift(songObject)
    this.setState({
      songs: newSongs,
      error: ""
    });
  }

  handlePlaylistSubmit = playlistID => {
    this.setState({loading: true});
    let data = { "playlist": playlistID };
    let url = process.env.REACT_APP_ANGERY_REACTS_SERVER_URL + "/playlist";
    if (url === undefined || url === null){
      console.log("Error: couldn't get server URL. Will default to matt's instance.")
      url = "https://angery-reacts-api.herokuapp.com/playlist";
    }
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .then(response => {
      if (!('error' in response)){
        response.songs.forEach(function(song){
          this.addSong(song);
        }.bind(this))
      }
      else{
        this.setState({error: response.error});
      }
      this.setState({loading: false});
    })
    .catch(error => {
      console.error('Error:', error);
      this.setState({error: "error making request!"});
      this.setState({loading: false});
    });
  }

  handleSongSubmit = (title, artist) => {
    this.setState({loading: true});
    let data = {
      "title": title, 
      "artist": artist
    };
    let url = process.env.REACT_APP_ANGERY_REACTS_SERVER_URL + "/lyrics";
    if (url === undefined || url === null){
      console.log("Error: couldn't get server URL. Will default to matt's instance.")
      url = "https://angery-reacts-api.herokuapp.com/lyrics";
    }
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .then(response => {
      if (response["error"] !== "song not found!"){
        this.addSong(response);
      }
      else{
        this.setState({error: "song not found, check your spelling!"});
      }
      this.setState({loading: false});
    })
    .catch(error => {
      console.error('Error:', error);
      this.setState({error: "error making request!"});
      this.setState({loading: false});
    });
  }
  render(){
    return (
      <div className="App">
        <Hero color="info">
          <Hero.Body>
            <Container>
              <Heading><span role="img" aria-label="angry react!">😡</span> angery reacts</Heading>
              <Heading subtitle>
                figure out how positive/negative your music library is
              </Heading>
            </Container>
          </Hero.Body>
        </Hero>
        <Section>
          <Container>
            <SearchBar 
              loading={this.state.loading} 
              handleSongSubmit={(title, artist) => this.handleSongSubmit(title, artist)}
              handlePlaylistSubmit={(playlist) => this.handlePlaylistSubmit(playlist)}
            ></SearchBar>
            <p>
              <b>raw score</b>: a sum of all the weights of the words in a song (where a positive weight is a positive word, and negative is negative)
              <br />
              <b>comparative</b>: raw score divided by total number of words in song, ranges from -5.0 to 5.0
            </p>
            <Heading subtitle color="danger">
                {this.state.error}
            </Heading>
            <hr />
            <SongsList songs={this.state.songs}></SongsList>
          </Container>
        </Section>
        <Footer>
          <Container>
            <Content className="has-text-centered">
              <p>
                built by <a href="https://matthewwang.me" target="_blank" rel="noopener noreferrer">matt wang!</a> check it out on <a href="https://github.com/malsf21/angery-reacts" target="_blank" rel="noopener noreferrer">github!</a>
              </p>
              <p>
                uses <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">react</a>, <a href="https://bulma.io/" target="_blank" rel="noopener noreferrer">bulma</a>, <a href="https://www.npmjs.com/package/sentiment" target="_blank" rel="noopener noreferrer">sentiment</a>, and the <a href="https://docs.genius.com/" target="_blank" rel="noopener noreferrer">genius api</a>
              </p>
            </Content>
          </Container>
        </Footer>
      </div>
    );
  }
}

export default App;
