var CommonActions = CommonActions || {}
// For All Form related function like field lock, field unlock etc
CommonActions.FormActions = class FormActions {
    constructor(executionContext) {
        if (executionContext) {
            this.executionContext = executionContext
            this.formContext = executionContext.getFormContext();
            this.globalContext = Xrm.Utility.getGlobalContext();
            this.formItem = this.formContext.ui.formSelector.getCurrentItem();
            this.formId = this.formItem.getId();
            this.formName = this.formItem.getLabel();
            console.log("class FormActions constructed");
        } else
            throw "Could not initiate FormActions class."
    }
     IsFormVisible() {
        if (this.formItem)
            return this.formItem.getVisible();
        else
            throw "No formItem found."
    }
     SetFormDisabled(isDisabled) {
        if (this.formContext) {
            let formControls = this.formContext.ui.controls;
            if (formControls !== "" && formControls !== null && formControls !== undefined && typeof (formControls) !== "undefined") {
                formControls.forEach(element => {
                    if (element.getName() !== "" && element.getName() !== null && element.getName() !== undefined && typeof (element.getName()) !== "undefined")   //Checking Null	for fields name 
                    {
                        element.setDisabled(isDisabled);
                    }
                });
            }
        }
        else
            throw "No formContext found."
    }
     SetFormVisible(isVisible) {
        if (this.formItem)
            this.formItem.setVisible(isVisible);
        else
            throw "No formItem found."
    }
     SetFormFieldsDisabled(fields, isDisabled) {
        if (this.formContext) {
            const formControls = [];
            fields.forEach(field => {
                let ctrl = this.formContext.getControl(field);
                formControls.push(ctrl);
            })

            if (formControls !== "" && formControls !== null && formControls !== undefined && typeof (formControls) !== "undefined" && formControls.length > 0) {
                formControls.forEach(element => {
                    if (element.getName() !== "" && element.getName() !== null && element.getName() !== undefined && typeof (element.getName()) !== "undefined")   //Checking Null	for fields name 
                    {
                        element.setDisabled(isDisabled);
                    }
                });
            }
        }
    }
     SetFormFieldsVisible(fields, isVisible) {
        if (this.formContext) {
            const formControls = [];
            fields.forEach(field => {
                let ctrl = this.formContext.getControl(field);
                formControls.push(ctrl);
            })

            if (formControls !== "" && formControls !== null && formControls !== undefined && typeof (formControls) !== "undefined" && formControls.length > 0) {
                formControls.forEach(element => {
                    if (element.getName() !== "" && element.getName() !== null && element.getName() !== undefined && typeof (element.getName()) !== "undefined")   //Checking Null	for fields name 
                    {
                        element.setVisible(isVisible);
                    }
                });
            }
        }
    }
     SetNotifications(notificationText, notificationLevel, uniqueId) {
        
        if (this.formItem && notificationText && uniqueId)
            this.formContext.ui.setFormNotification(notificationText, notificationLevel, uniqueId);
    }
     RemoveNotifications(uniqueId) {
        if (this.formItem && uniqueId)
            this.formContext.ui.clearFormNotification(uniqueId);
    }
}

// For All record related function like update etc
CommonActions.DataActions = class DataActions {
    constructor(executionContext) {
        if (executionContext) {
            this.executionContext = executionContext
            this.formContext = executionContext.getFormContext();
            this.globalContext = Xrm.Utility.getGlobalContext();
            this.entityName = this.formContext.data.entity.getEntityName();
            this.entityId = this.formContext.data.entity.getId();
            console.log("class DataActions constructed");
        } else
            throw "Could not initiate DataActions class."
    }
     async saveForm(saveOption) {
        await this.formContext.data.entity.save(saveOption);
    }
}

// For all BPF related function like Restrict Stage move etc
CommonActions.BPFActions = class BPFActions {
    constructor(executionContext) {
        if (executionContext) {
            this.executionContext = executionContext;
            this.processArgs = executionContext.getEventArgs();
            this.formContext = executionContext.getFormContext();
            this.globalContext = Xrm.Utility.getGlobalContext();
            this.bpfArgs = executionContext.getEventArgs();
            this.stageName = this.bpfArgs._stage._stageStep.description;
            console.log("class BPFActions constructed");
        } else
            throw "Could not initiate BPFActions class."
    }
    preventBPFDefaultForDARSCaseOfficerTeam() {
        this.bpfArgs.preventDefault();

        if (this.executionContext.getEventArgs().isDefaultPrevented()) {
            var notificationId = "DARS Case Officer Team";
            var message = "Stage movement is allowed for DARS Case Officer Team between 1A to 1C and 2A to 3A";
            var type = "INFO";
            this.executionContext.getFormContext().ui.setFormNotification(message, type, notificationId);
        }          
    }
    preventBPFDefaultForDARSBusinessManagementTeam() {
        this.bpfArgs.preventDefault();

        if (this.executionContext.getEventArgs().isDefaultPrevented()) {
            var notificationId = "DARS Business Management Team";
            var message = "Stage movement is not allowed for DARS Business Management Team";
            var type = "INFO";
            this.executionContext.getFormContext().ui.setFormNotification(message, type, notificationId);
        }
    }
    preventBPFDefaultForDARSOnboardingTeam() {
        this.bpfArgs.preventDefault();

        if (this.executionContext.getEventArgs().isDefaultPrevented()) {
            var notificationId = "DARS Onboarding Team";
            var message = "Stage movement is not allowed for DARS Onboarding Team";
            var type = "INFO";
            this.executionContext.getFormContext().ui.setFormNotification(message, type, notificationId);
        }
    }
    preventBPFDefaultForIGARDTeam() {
        this.bpfArgs.preventDefault();

        if (this.executionContext.getEventArgs().isDefaultPrevented()) {
            var notificationId = "IGARD Team";
            var message = "Stage movement is allowed for IGARD Team from 4B to 3A and 4C and from 4B to 4C";
            var type = "INFO";
            this.executionContext.getFormContext().ui.setFormNotification(message, type, notificationId);
        }
    }
    preventBPFDefaultForDARSDAOTeam() {
        this.bpfArgs.preventDefault();

        if (this.executionContext.getEventArgs().isDefaultPrevented()) {
            var notificationId = "DARS DAO Team";
            var message = "Stage movement is allowed for DARS DAO Team to (1C or 2B from 2A) and (3B from 3A) and (4A from 3B) and (3A or 4B from 4A) and (3A or 4C from 4B) and (3A or 4D from 4C) and (3A or 4E from 4D) where Senior DAO can only approve at 4D";
            var type = "INFO";
            this.executionContext.getFormContext().ui.setFormNotification(message, type, notificationId);
        }
    }
    preventBPFDefaultForDARSDirectorTeam() {
        this.bpfArgs.preventDefault();

        if (this.executionContext.getEventArgs().isDefaultPrevented()) {
            var notificationId = "DARS Director Team";
            var message = "Stage movement is allowed for DARS Director Team between (4C, 4D, 4E) and from (4D to 3A, 3B and 4C) and from (4E to 4C and 4D)";
            var type = "INFO";
            this.executionContext.getFormContext().ui.setFormNotification(message, type, notificationId);
        }
    }
}
