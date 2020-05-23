import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord,  deleteRecord } from 'lightning/uiRecordApi';

import getEmployeeList from '@salesforce/apex/getData.getEmployeeList';
import { refreshApex } from '@salesforce/apex';
import Employee_Object from '@salesforce/schema/Employee__c';
import ID_FIELD from '@salesforce/schema/Employee__c.Emp_ID__c';
import NAME_FIELD from '@salesforce/schema/Employee__c.Name';
import EMAIL_FIELD from '@salesforce/schema/Employee__c.Email__c';
import PRIMARY_FIELD from '@salesforce/schema/Employee__c.Primary_Skill__c';
import SECONDARY_FIELD from '@salesforce/schema/Employee__c.Secondary_Skill__c';
import EXPERIENCE_FIELD from '@salesforce/schema/Employee__c.Experience__c';
import COMMENTS_FIELD from '@salesforce/schema/Employee__c.Comments__c';

const actions = [
    { label: 'Record Details', name: 'record_details' },
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' }
];

const columns = [
    
    { label: 'Emp Name', fieldName: 'Name',type: 'text' },
    {label: 'Emp Id',fieldName: 'Emp_ID__c',type: 'number'},
    { label: 'Emp Email', fieldName: 'Email__c',type: 'email' },
    { label: 'Primary Skill', fieldName: 'Primary_Skill__c',type: 'text' },
    { label: 'Secondary skill', fieldName: 'Secondary_Skill__c',type: 'text'},
    { label: 'Experience', fieldName: 'Experience__c',type: 'number'},
    { label: 'comments', fieldName: 'Comments__c',type: 'text'},
    {
        type: 'action',
        typeAttributes: {
            rowActions: actions
        }
    }
];

export default class ED extends LightningElement {
    
//inserting data into database
Name='';
Id='';
Email='';
PrimarySkill='';
SecondarySkill='';
Experience='';
Comments='';

    inputChange(event){
        if( event.target.name == 'Name' ){
            this.Name = event.target.value;
        }
       else if( event.target.name == 'Id' ){
            this.Id = event.target.value;
        }
        else if( event.target.name == 'Email' ){
            this.Email = event.target.value;
        }
        else if( event.target.name == 'PrimarySkill' ){
            this.PrimarySkill = event.target.value;
        }
        
        else if( event.target.name == 'SecondarySkill' ){
            this.SecondarySkill = event.target.value;
        }
        
        else if( event.target.name == 'Experience' ){
            this.Experience = event.target.value;
        }
        else if( event.target.name == 'Comments' ){
            this.Comments = event.target.value;
        }
     }
     addEmployee() {
        const fields = {};
        fields[NAME_FIELD.fieldApiName] = this.Name;
        fields[ID_FIELD.fieldApiName] = this.Id;
        fields[EMAIL_FIELD.fieldApiName] = this.Email;
        fields[PRIMARY_FIELD.fieldApiName] = this.PrimarySkill;
        fields[SECONDARY_FIELD.fieldApiName] = this.SecondarySkill;
        fields[EXPERIENCE_FIELD.fieldApiName] = this.Experience;
        fields[COMMENTS_FIELD.fieldApiName] = this.Comments;
        const recordInput = { apiName: Employee_Object.objectApiName, fields };
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
      

    @wire(getEmployeeList)
    employees;
    @track columns = columns;
    @track employees=[];
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
                this.editCurrEmp(row);
                break;   
            case 'delete':
                
                this.deleteEmp(row);
                break;
 }
}

editCurrEmp(currRow) {
    
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

deleteEmp(currRow) {
    deleteRecord(currRow.Id).then(() => {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Deleted',
            message: 'Record Deleted !',
            variant: 'success'
        }));
        return refreshApex(this.employees);
    }).catch(error => {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Error',
            message: 'Record could not be Deleted !',
            variant: 'error'
        }));
    });
}


    
    }  