if (typeof AccountDefinitions === 'undefined') {
    // variable is undefined
    AccountDefinitions = {}
}
if (typeof AccountDefinitions.Context === 'undefined') {
    // variable is undefined
    AccountDefinitions.Context = {}
}
if (typeof AccountDefinitions.Actions === 'undefined') {
    // variable is undefined
    AccountDefinitions.Actions = {}
}

// Initilizing Parent and Child Class
AccountDefinitions.Context.CurrentAppContext = class CurrentAppContext extends CommonContext.CurrentAppContext {
    constructor(executionContext, appName) {
        if (executionContext && appName) {
            super(executionContext, appName);
            console.log("class CurrentAppContext constructed");
        } else
            throw "Could not initiate CurrentAppContext class."
    }
}

// Initilizing Parent and Child Class
AccountDefinitions.Context.CurrentUserContext = class CurrentUserContext extends CommonContext.CurrentUserContext {
    constructor(executionContext, teamDetails, teamNames) {
        if (executionContext && teamDetails && teamNames) {
            super(executionContext, teamDetails, teamNames);
            console.log("class CurrentUserContext constructed");
        }
        else
            throw "Could not initiate CurrentUserContext class."
    }

}

// Initilizing Parent and Child Class
AccountDefinitions.Context.CurrentFormContext = class CurrentFormContext extends CommonContext.CurrentFormContext {
    constructor(executionContext) {
        if (executionContext) {
            super(executionContext);
            console.log("class CurrentFormContext constructed");
        } else
            throw "Could not initiate CurrentFormContext class."
    }

}

// Initilizing Parent and Child Class
AccountDefinitions.Context.DataContext = class DataContext extends CommonContext.DataContext {
    constructor(executionContext) {
        super(executionContext);
    }
}

// Initilizing Parent and Child Class
AccountDefinitions.Context.CurrentJsonConfigurationContext = class CurrentJsonConfigurationContext extends CommonContext.CurrentJsonConfigurationContext {
    constructor(executionContext, CurrentJsonConfigurationList) {
        if (executionContext && CurrentJsonConfigurationList) {
            super(executionContext, CurrentJsonConfigurationList);
            console.log("class CurrentUserContext constructed");
        }
        else
            throw "Could not initiate CurrentUserContext class."
    }
}

// Initilizing Parent and Child Class
AccountDefinitions.Actions.FormActions = class FormActions extends CommonActions.FormActions {
    constructor(executionContext) {
        super(executionContext);
    }
}

// Initilizing Parent and Child Class
AccountDefinitions.Actions.DataActions = class DataActions extends CommonActions.DataActions {
    constructor(executionContext) {
        super(executionContext);
    }
}