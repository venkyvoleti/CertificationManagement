import { LightningElement, wire, track } from 'lwc';
import getContactList from '@salesforce/apex/ContactController.getContactList';

const columns = [
    { label: 'First Name', fieldName: 'Department' }
    
];
export default class ApexDatatableExample extends LightningElement {

    @track error;
    @track columns = columns;

     @wire(getContactList)
    contacts;

}