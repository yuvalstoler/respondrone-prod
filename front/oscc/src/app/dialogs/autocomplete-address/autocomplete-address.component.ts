import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
// import {} from 'googlemaps';

@Component({
  selector: 'app-autocomplete-address',
  templateUrl: './autocomplete-address.component.html',
  styleUrls: ['./autocomplete-address.component.scss']
})
export class AutocompleteAddressComponent implements OnInit {

  @Input() adressType: string;
  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  @ViewChild('addresstext') addresstext: any;

  autocompleteInput: string;
  queryWait: boolean;

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.getPlaceAutocomplete();
  }

  private getPlaceAutocomplete = () => {
    // const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement,
    //   {
    //     componentRestrictions: { country: 'US' },
    //     types: [this.adressType]  // 'establishment' / 'address' / 'geocode'
    //   });
    // google.maps.event.addListener(autocomplete, 'place_changed', () => {
    //   const place = autocomplete.getPlace();
    //   this.invokeEvent(place);
    // });
  };

  invokeEvent = (place: Object) => {
    this.setAddress.emit(place);
  };

}
