import { LightningElement, track } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class PostalCodeComp extends LightningElement {
    @track postalCode;
    @track mapMarkers = [];
    zoomLevel;
    listView; 
    addressFound = false;

    // connectedCallback() {
       
    // }
    
    handlePostalcode(event){
        this.postalCode = event.detail.value;
        console.log(`Postal/Zip Code ${this.postalCode}`)
    }


    getMapLocations(){
        this.addressFound = false;
        this.mapMarkers = [];
        if(this.postalCode) {
            fetch("https://api.postalpincode.in/pincode/"+this.postalCode, { method: "GET" })
            .then((response) => {
                if(response.ok) {
                    // this.addressFound = true;
                    return response.json();
                } else {
                    throw Error(response);
                }
            })
            .then((data) => {
                console.log(`data ${JSON.stringify(data)}`);
                let arrdata = data[0].PostOffice;
                console.log(arrdata);
                arrdata.forEach(element => {
                    console.log(element);
                    let loc = {City: '', Country: '', PostalCode: '', State:'', Street:''}
                    let res = {location : loc, title: '', description: '', icon:'standard:location'}
                    loc.City = element.Division;
                    loc.Country = element.Country;
                    loc.PostalCode = element.Pincode;
                    loc.State = element.State;
                    loc.Street = element.Name;
                    console.log(loc);
                    res.location = loc;
                    res.title = element.Name;
                    res.description = element.Name +' Area ';
                    console.log(res);
                    this.mapMarkers = [...this.mapMarkers, res];
                });
                console.log(JSON.stringify(this.mapMarkers));
                this.zoomLevel = 10;
                this.listView = "visible";  
                this.addressFound = true;
            })
            .catch(error => {
                console.log(`error postal code ${JSON.stringify(error)}`)
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error', 
                        message: 'Postal Code not found', 
                        variant: 'error'
                    }),
                );
            })
        }else{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Oops..', 
                    message: 'Please specify Postal/Zip Code', 
                    variant: 'warning'
                }),
            );
        }
    }
}