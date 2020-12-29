import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
// import { } from 'googlemaps';
// import { } from '@types/googlemaps';
/// <reference path="../../../../../../node_modules/@types/googlemaps/index.d.ts"/>

@Component({
  selector: 'app-autocomplete-address',
  templateUrl: './autocomplete-address.component.html',
  styleUrls: ['./autocomplete-address.component.scss']
})
export class AutocompleteAddressComponent implements OnInit {

  @Input() address: string;
  @Input() addressType: string;
  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  @ViewChild('addresstext') addressText: any;

  // autocompleteInput: string;
  queryWait: boolean;

  constructor() {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    // this.autocompleteInput = this.address;
    this.getPlaceAutocomplete();
  }

  private getPlaceAutocomplete = () => {
    const autocomplete = new google.maps.places.Autocomplete(this.addressText.nativeElement,
      {
        componentRestrictions: { country: 'FR' },
        types: [this.addressType]  // 'establishment' / 'address' / 'geocode'
      });
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      this.invokeEvent(place);
    });
  };

  invokeEvent = (place: Object) => {
    this.setAddress.emit(place);
  };

}
