import React,{ Component } from 'react'

class Get extends Component {
    constructor(props) {
      super(props);
      this.delete = this.delete.bind(this);
      this.state = { array:[], location:'',runs:'',rating:'', id:'', buttonText: 'Post',  errorMessage: '', put:false} 
      this.handleChange = this.handleChange.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
    }
    

    handleSubmit(event){
      const {location, runs, rating} = this.state
      let ratingValue ;
    //On inget värde är angivet, använd 1 som "default"
      if ( `${rating}` != ""){
          ratingValue = `${rating}`
      }
      else{
        ratingValue = "1"
      }
      event.preventDefault()
    //Skicka error om något fält är tomt
    if ( `${location}` == "" || `${runs}` == ""){
      this.setState({ errorMessage: "Fill all" });
    }
    else{
      //Gör post eller put förfrågan beroende på om post eller update mode är aktiverat
      if( this.state.put == false){
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "location": `${location}`, "runs": `${runs}`, "rating": `${ratingValue}`})
    }
    
    fetch('https://skidiaryapi.herokuapp.com/posts', requestOptions)
        .then(async response => {
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const data = isJson && await response.json();
  
            if (!response.ok) {
  
                const error = (data && data.message) || response.status;
                return Promise.reject(error);
            }
            window.location.reload();
        })
        .catch(error => {
            this.setState({ errorMessage: error.toString() });
            console.error('There was an error!', error);
        });
  

    }
    else{
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "location": `${location}`, "runs": `${runs}`, "rating": `${ratingValue}`})
    }
    

    fetch('https://skidiaryapi.herokuapp.com/posts/' + this.state.id, requestOptions)
        .then(async response => {
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const data = isJson && await response.json();
  
            if (!response.ok) {
  
                const error = (data && data.message) || response.status;
                return Promise.reject(error);
            }
            window.location.reload();
        })
        .catch(error => {
            this.setState({ errorMessage: error.toString() });
            console.error('There was an error!', error);
        });
    }
    }
  }

    handleChange(event){
      //Updatera värden i formulärets input-fields
      this.setState({
        [event.target.name] : event.target.value
      })
    }
    

    edit(item) {
      this.setState({ location: item.location, runs: item.runs, rating: item.rating, id: item._id, put: true })
      this.setState({ buttonText: "Update"});
    }


    delete(id) {
      //Ta bort item med skickat ID
    fetch('https://skidiaryapi.herokuapp.com/posts/'+ id, { method: 'DELETE' })
    .then(async response => {
        const data = await response.json(); 

        //kontrollera response
        if (!response.ok) {

            const error = (data && data.message) || response.status;
            return Promise.reject(error);
        }
        //ladda om servern, om allt går som det ska
        window.location.reload();
    })
    //Visa fel om något går fel
 .catch(error => {
 this.setState({ errorMessage: error.toString() });
   console.error('There was an error...', error);
    });
}
    componentDidMount() {

      //Hämta alla items
        fetch('https://skidiaryapi.herokuapp.com/posts')
            .then(async response => {
                const data = await response.json();
    
       
                if (!response.ok) {
        
                    const error = (data && data.message) || response.statusText;
                    return Promise.reject(error);
                }
               //Lagra alla items från databasen i en array
               data.reverse();
                  this.setState({ array: data}) })
            .catch(error => {
                this.setState({ errorMessage: error.toString() });
                console.error('There was an error...', error);
            });
    }
 
    render() {
        const { array } = this.state
        
          return( 
            //Generera HTML kod
            <>
                <span>{this.state.errorMessage}</span>
      <form id="form" onSubmit={this.handleSubmit}>
        <div>
          <h2> Add New </h2>
          <label htmlFor='location'>Location: </label>
          <input 
            name='location'
            value = {this.state.location}
            onChange={this.handleChange}
          />   </div>
   
        <div>
          <label htmlFor='runs'>Runs: </label>

          <input onChange={this.handleChange} name='runs' value={this.state.runs} >
          
</input>
        </div>

        <div>    
    <label htmlFor='rating'>Rating: </label>
    <select name={'rating'} value={this.state.rating} onChange={this.handleChange}>
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4">4</option>
    <option value="5">5</option>
    <option value="6">6</option>
    <option value="7">7</option>
    <option value="8">8</option>
    <option value="9">9</option>
    <option value="10">10</option>
  </select>
  <span>/ 10</span>
        </div>
        <div>
          <button>{this.state.buttonText}</button>
        </div>


      </form>
            {array.map(item => 
            //Loopa alla "items" och skriv ut deras innehåll/egenskaper
            <React.Fragment key={item._id}>
            <ul id={item._id} className="postBox">
                <li><h2>Today I went skiing in <b>{item.location} </b>.</h2></li>
             <li><h3>I did <b>{item.runs} </b>runs.</h3></li>
             <li> The day gets <b>{item.rating} / 10 ☀ </b></li>
        
           <li>  <p>Date: {item.date}</p></li>
          
           <li>
           <button onClick={() =>this.delete(item._id)}>X</button>
           </li> 

           </ul>
           </React.Fragment>
            
           )}

           </>
           
          )
        }
  }
  
  export default Get

