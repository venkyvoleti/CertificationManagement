import { LightningElement,wire,track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { createRecord, updateRecord, deleteRecord } from 'lightning/uiRecordApi';

import getcertData from '@salesforce/apex/getData.getcertData';
import Certification_Object from '@salesforce/schema/Certification__c';
import CertID_FIELD from '@salesforce/schema/Certification__c.Cert_Id__c';
import CertNAME_FIELD from '@salesforce/schema/Certification__c.Name';
import CertCOMMENTS_FIELD from '@salesforce/schema/Certification__c.Comments__c';

const actions = [
    { label: 'Record Details', name: 'record_details' },
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' }
];

const columns = [
    { label: 'CERT ID', fieldName: 'Cert_Id__c',type: 'number' },
    { label: 'CERT Name', fieldName: 'Name',type: 'text' },
    { label: 'comments', fieldName: 'Comments__c',type: 'text'},
    {
        type: 'action',
        typeAttributes: {
            rowActions: actions
        }
    }
];

export default class CD extends LightningElement {

    //inserting data into database
Name='';
Id='';
Comments='';

    inputChange(event){
        if( event.target.name == 'Name' ){
            this.Name = event.target.value;
        }
        else if( event.target.name == 'Id' ){
            this.Id = event.target.value;
        }
       
        else if( event.target.name == 'Comments' ){
            this.Comments = event.target.value;
        }
     }
     addCertificate() {
        const fields = {};
        fields[CertNAME_FIELD.fieldApiName] = this.Name;
        fields[CertID_FIELD.fieldApiName] = this.Id;
        fields[CertCOMMENTS_FIELD.fieldApiName] = this.Comments;
        const recordInput = { apiName: Certification_Object.objectApiName, fields };
        createRecord(recordInput)
            .then(() => {
                
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Account created',
                        variant: 'success',
                    }),
                );
                location.reload();
            })
            
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });
    }

    //inserting data into database Ends

    //fetching the data from Database

    
    
    
   

    @wire(getcertData)
    certifications;
    @track columns = columns;
    @track certifications=[];
    @track isEditForm=false;
    @track currentRecordId;
    error;
    

    handleRowActions(event) {
        const action = event.detail.action;
        const row = event.detail.row;
        switch (action.name) {
            case 'record_details':
                alert('Record Details: ' + JSON.stringify(row));
                break;
            case 'edit':
                this.editCurrCer(row);
                break;   
            case 'delete':
                
                this.deleteCer(row);
                break;
 }
}
editCurrCer(currRow) {
    
    this.isEditForm = true;
    this.currentRecordId = currRow.Id;
}

showNotificationUpdate() {
    const evt = new ShowToastEvent({
        title: 'Success',
        message: 'Record Updated',
        variant: 'success',
    });
    this.dispatchEvent(evt);
    location.reload();
}
showErrorUpdate() {
    const evt = new ShowToastEvent({
        title: 'Error',
        message: 'Record could not be Updated',
        variant: 'Error',
    });
    this.dispatchEvent(evt);
   
}

deleteCer(currRow) {
    deleteRecord(currRow.Id).then(() => {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Deleted',
            message: 'Record Deleted !',
            variant: 'success'
        }));
        return refreshApex(this.certifications);
    }).catch(error => {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Error',
            message: 'Record could not be Deleted !',
            variant: 'error'
        }));
    });
}
    
}








