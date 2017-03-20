angular
  .module('app', ['firebase'])
  // You need to fill in your own config properties from the firebase console
  .constant('firebaseConfig', {
    apiKey: "AIzaSyDLvvFCVECIY3zbLiWwJMpOle3_K6yjS0w",
    authDomain: "fir-app-7b5b0.firebaseapp.com",
    databaseURL: "https://fir-app-7b5b0.firebaseio.com",
    storageBucket: "fir-app-7b5b0.appspot.com",
    messagingSenderId: "744491786267"
  })
    .run(firebaseConfig => firebase.initializeApp(firebaseConfig))
  .service('dbRefRoot', DbRefRoot)
  .service('contacts', Contacts)
  .factory('contactFactory', ContactFactory)
  .factory('contactListFactory', ContactListFactory)
  .controller('ContactCtrl', ContactCtrl)

function ContactFactory($firebaseObject, $firebaseUtils) {
    return $firebaseObject.$extend({
        $$updated: function (snap) {
  const changed = $firebaseObject.prototype.$$updated.apply(this, arguments);
    if (changed) {
        this.birthDate = this.birthDate ? new Date(this.birthDate) : null
      }
     return changed
    },
        toJSON: function() {
            
            return $firebaseUtils.toJSON(angular.extend({}, this, {birthDate: this.birthDate ? this.birthDate.getTime() : null
                                                                }))
        },
         $$defaults: {
      firstName: '',
      lastName: '',
      number: '',
      email: '',
      birthDate: new Date(),
     
    }
        
    })
}

function ContactListFactory($firebaseArray, contactFactory) {
    return $firebaseArray.$extend({
        
        $$added: function(snap) {
            return contactFactory(snap.ref)
        }
    })
}
function DbRefRoot() {
    return firebase.database().ref()
}
function Contacts(dbRefRoot, contactFactory, contactListFactory){
    
const dbRefContacts = dbRefRoot.child('contacts')

this.get = id => contactFactory(dbRefContacts.child(id))
this.getAll = () => contactListFactory(dbRefContacts)
this.getDefaults = () => contactFactory(dbRefContacts.child(0))
}

function ContactCtrl(contacts) {
    
    this.newContact = contacts.getDefaults()
    this.contact = contacts.get('whatever')
    this.contacts = contacts.getAll()
    this.remove = contact => {
        
        if (confirm('Delete this contact')) {
            this.contacts.$remove(contact)
        }
    }
      this.save = contact => { this.contacts.$save(contact) }
    this.addContact = newContact => {
        
        this.contacts 
        .$add(newContact)
        .then( newRef => {this.newContact = contacts.getDefaults() })
    }
    
    
    
    
    
}