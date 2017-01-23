/*
 * @module adminStudents
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import '../../../public/css/select2.min.css';

import { Students }     from '../../../both/collections/api/students.js';
import { Newsfeeds }    from '../../../both/collections/api/newsfeeds.js';
import { Comments }     from '../../../both/collections/api/comments.js';
import { Departments }  from '../../../both/collections/api/departments.js';
import { Companies }    from '../../../both/collections/api/companies.js';

import '../../templates/admin/admin-students.html';


/*
 * CREATED
 */
Template.adminStudents.onCreated( function() {

  //$("#students-cover").show();


  /*
   * BOOTSTRAP3-DIALOG
   */
  $.getScript( '/bower_components/bootstrap3-dialog/dist/js/bootstrap-dialog.min.js', function() {
      //console.log('student:: bootstrap-dialog loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'student:: load bootstrap-dialog.min.js fail' );
    //console.log( 'jqxhr ' + jqxhr );
    //console.log( 'settings ' + settings );
    //console.log( 'exception: ' + exception );
  });
//-------------------------------------------------------------------


  /*
   * SELECT2
  */
  $.getScript( '/js/select2.min.js', function() {
    $( document ).ready(function(){
      $( '#search-students' ).select2({
        placeholder: "Search students",
        allowClear: true,
        multiple: false,
        tags:false
      });
      
      $( '.js-dept' ).select2({
        placeholder: "Department",
        allowClear: true,
        multiple: true,
        tags:true
      });

      $( '.js-role' ).select2({
        placeholder: "User class",
        allowClear: true,
        multiple: false,
        tags:false
      });
    });
    //console.log('students:: chosen,jquery.min.js loaded...');
  }).fail( function(jqxhr, settings, exception ) {
    console.log( 'students:: load select2.js fail' );
    //console.log( 'jqxhr ' + jqxhr );
    //console.log( 'settings ' + settings );
    //console.log( 'exception: ' + exception );
  });
});



/*
 * RENDERED
 */
Template.adminStudents.onRendered( function() {
/*
  $( '#students-cover' ).delay( 100 ).fadeOut( 'slow', function() {
    $("#students-cover").hide();
    $( ".filter-buttons" ).fadeIn( 'slow' );
  });
*/

});


/*
 * HELPERS
 */
Template.adminStudents.helpers({

  students() {
    let s   = Students.find({ company_id: Meteor.user().profile.company_id }).fetch();
    let len = s.length;
    for( let i=0; i<len; i++ ) {
      s[i].created_at = moment( s[i].created_at ).format( 'M-D-Y' ) //modify array in place
    }

    return s;
  },

});



/*
 * EVENTS
 */
Template.adminStudents.events({

  /*
   * #SEARCH-STUDENTS  ::(CHANGE)::
   */
  'change #search-students'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let idx = $( e.currentTarget ).val();
    if ( idx ) {
      $( 'tr' ).css( 'border', '' );
      $( 'tr#' + idx ).css( 'border', '1px solid' );
      $( 'html, body' ).animate({
        scrollTop: $( 'tr#' + $( e.currentTarget ).val() ).offset().top + 'px'
      }, 'fast' );
    }
//-------------------------------------------------------------------
  },


  /*
   * #CLOSE-SEARCH  ::(CLICK)::
   */
  'click #close-search'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    $( '#search-students' ).val('');
//-------------------------------------------------------------------
  },



  /*
   * .JS-STUDENT  ::(CLICK)::
   */
  'click .js-student'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if ( Meteor.userId() == $( e.currentTarget ).data( 'id' ) ) return;

    FlowRouter.go( 'student-record', { _id: $(e.currentTarget).data('id') });

    //$(e.currentTarget).data('id'));
    //console.log( Template.instance().view.parentView );
    //console.log( Template.adminStudentsBase );
//-------------------------------------------------------------------
  },


  /*
   * .JS-IMPORT-STUDENTS-CSV  ::(CLICK)::
   */
  'click .js-import-students-csv'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-import-csv', { _id: Meteor.userId() });
//-------------------------------------------------------------------
  },


  /*
   * .JS-ADD-STUDENT  ::(CLICK)::
   */
  'click .js-add-student'( e, t ) {
    e.preventDefault();
    //e.stopImmediatePropagation();

    //DEPT MUST HAVE A VALUE

    let dpt = Departments.find({}).fetch();

    //clear created by code options
    $( '.js-dept option' ).each(function(){
      $(this).remove();
    });

    Meteor.setTimeout(function(){

      $( '.js-dept' ).append( '<option></option>' );
      
      for( let i = 0, l = dpt.length; i < l; i++ ){
        
        $( '.js-dept' ).append( '<option value="' + dpt[i]._id + '">' +
                                  dpt[i].name + '</option>' 
                              );
      }
    }, 500);
//-------------------------------------------------------------------
  },


  /*
   * .JS-STUDENT-ADD-SUBMIT  ::(CLICK)::
   */
  'click .js-add-student-submit'( e, t ) {
      e.preventDefault();
      e.stopImmediatePropagation();

      //DEPT MUST HAVE A VALUE
      //option value
      //console.log( t.$('.js-dept').val() );

      //INSERT ADDED DEPT TO DEPT DB if it doesn't exist
      let foo;
      try {
        foo = Departments.findOne({ _id: t.$('.js-dept option:selected').val() })._id;
      } catch( e ) {
        foo = Departments.insert({ company_id: Meteor.user().profile.company_id, name: t.$( '.js-dept option:selected' ).text() });
      }

      $( '#addStudentModal' ).modal( "hide" );


      let co = Companies.findOne({ _id: Meteor.user().profile.company_id });

      let fname     = $( '.js-fn' ).val().trim();
      let lname     = $( '.js-ln' ).val().trim();
      let email     = $( '.js-email' ).val().trim();
      let dept      = $( '.js-dept :selected' ).text();
      let opt       = $( '#sel1' ).val();

      /* ASSIGN random password */
      //todo: assign random password;
      let password = 'afdsjkl83212';

      let url       = 'https://collective-university-nsardo.c9users.io/login';
      let text      = `Hello ${fname},\n\nThis organization has set up its own Collective University to help provide training and more sharing of internal knowledge.  Your plan administrator will be providing more details in the coming days.\n\nTo login to your account and enroll in classes, please visit: ${url}.\n\nUsername: ${email}\nPass: ${password}\n\nFrom here you'll be able to enroll in courses, to request credit for off-site training and conferences, and keep track of all internal training meetings.\nIn Student Records, you'll see all the classes and certifications you have completed.  For a more complete overview, please see this video:\n\nIf you have any questions, please contact: `;

      //ALL FIELDS MUST BE FILLED OUT OR ERR
      Meteor.call( 'addUser', email, password, fname, lname, opt, dept, co.name, co._id );

      Meteor.call( 'sendEmail', email, 'admin@collectiveuniversity.com', 'New Account', text );

      /*
      Meteor.call('sendEmail',
                  'nsardo@msn.com',
                  'bob@example.com',
                  'Hello from Meteor!',
                  'This is a test of Email.send.');
      */

      //clear created by code options
      $( '.js-dept option').each(function(){
        $(this).remove();
      });

      $( '.js-fn' ).val('');
      $( '.js-ln' ).val('');
      $( '.js-email' ).val('');

      Bert.alert( 'Account Created', 'success', 'growl-top-right' );
      $( '#addStudentModal' ).modal( "hide" );
//-------------------------------------------------------------------
  },



  /*
   * .JS-EDIT-STUDENT  ::(CLICK)::
   */
  'click .js-edit-student'( e, t ) {
      e.preventDefault();
      //e.stopImmediatePropagation();
      //DEPT MUST HAVE A VALUE

      const sTypes = [ 'student', 'teacher', 'admin' ];

      let id = t.$( e.currentTarget ).data( 'id' );
      let s  = Students.findOne({ _id: id });


      t.$( '.js-fn' ).attr( 'placeholder', s.fname );
      t.$( '.js-ln' ).attr( 'placeholder', s.lname );
      t.$( '.js-email' ).attr( 'placeholder', s.email );

      let dpt = Departments.find( {} ).fetch();

      //clear created by code options
      $( '.js-dept option' ).each(function(){
        $(this).remove();
      });
      
      $( '.js-role option' ).each(function(){
        $(this).remove();
      });

      Meteor.setTimeout(function(){
        
        for( let i = 0, l = dpt.length; i < l; i++ ){
          
          $( '.js-dept' ).append( '<option value="' + dpt[i]._id + '">' +
                                    dpt[i].name + '</option>' 
                                );
        }
        for( let i = 0, l = sTypes.length; i < l; i++ ){
          
          $( '.js-role' ).append( '<option value="' + sTypes[i] +  '">'  +
                                  capitalizeFirstLetter( sTypes[i] ) + '</option>' 
                                );
        }
        $( 'select[name="js-dept"]').find('option:contains("'  + s.department                     + '")' ).attr( "selected",true );
        $( 'select[name="js-role"]').find('option:contains("'  + capitalizeFirstLetter(s.role)    + '")' ).attr( "selected",true );
      }, 500);
//-------------------------------------------------------------------
  },



  /*
   * .JS-EDIT-STUDENT-SUBMIT  ::(CLICK)::
   */
  'click .js-edit-student-submit'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let id = t.$( '.js-edit-student' ).data( 'id' );

    let s  = Students.findOne({ _id: id });


    //DEPT MUST HAVE A VALUE
    let r   = $( '.js-role' ).select2( 'data' )[0].text.toLowerCase(),
        em  = $( '.js-email' ).val()            || s.email,
        d   = $( '.js-dept' ).select2( 'data' )[0].text;
        url = 'https://collective-university-nsardo.c9users.io/login';


    // ALL FIELDS MUST BE FILLED OUT OR ERROR
    Students.update({ _id: id },
                    {$set:{ role: r,
                            email:em,
                            department:d,
                            updated_at: new Date() } });


    // ALL FIELDS MUST BE FILLED OUT OR ERROR
    Meteor.users.update({ _id: id }, {$set:{ roles: { [r] : true } }  });

    if ( r == 'teacher' ) {
      let text = `Hello ${fn},\n\nThe administrator of Collective University has upgraded your account to teacher level so that you may now create courses and schedule training sessions within our Corporate University.  As an expert within the organization, it's important to provide you the opportunity to share your knowledge with others so you will get credit for every class you teach and course you build.\n\nYou can login here: ${url}\n\nUser: ${e}\nPass: ${s.password}`;
      Meteor.call('sendEmail', em, 'admin@collectiveuniversity.com', 'Upgraded Account', text );
    }


    t.$( '.js-fn' ).attr( 'placeholder',     "" );
    t.$( '.js-ln' ).attr( 'placeholder',     "" );
    t.$( '.js-email' ).attr( 'placeholder',  "" );

    //clear created by code options
    $( '.js-dept option' ).each(function(){
      $(this).remove();
    });
    $( '.js-role option' ).each(function(){
      $(this).remove();
    });

    Bert.alert( 'Edits to student record recorded', 'success', 'growl-top-right' );
    $( '#editStudentModal' ).modal( "hide" );

//-------------------------------------------------------------------
  },



  /*
   * #POPUP-CLOSE  ::(CLICK)::
   */
   'click #popup-close'( e, t ){
     e.preventDefault();
      t.$( '.js-fn' ).attr( 'placeholder', "" );
      t.$( '.js-ln' ).attr( 'placeholder', "" );
      t.$( '.js-email' ).attr( 'placeholder', "" );

      //clear created by code options
      t.$( '.js-dept option' ).each(function(){
        t.$(this).remove();
      });

      t.$( '.js-role option' ).each(function(){
        t.$(this).remove();
      });
   },



  /*
   * .JS-DELETE-STUDENT  ::(CLICK)::
   */
  'click .js-delete-student'( e, t ) {
    e.preventDefault();

    /* ARE YOU SURE YOU WANT TO DELETE... */
    let id = t.$(  e.currentTarget ).data( 'id' );
    let s  = Students.findOne({ _id: id });

    t.$( '#fnln' ).html( s.fname + "&nbsp;" +  s.lname );
    t.$( '.name' ).data( 'id', id );
    t.$( '#stdimg' ).attr( 'src', s.avatar );

//-------------------------------------------------------------------
  },



  /*
   * .JS-STUDENT-DELETE-SUBMIT  ::(CLICK)::
   */
  'click .js-delete-student-submit'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let id = t.$( '.name' ).data( 'id' );

    Students.remove( id );
    Meteor.users.remove( id );

    Bert.alert( 'Student record deleted','danger' );

    t.$( '#fnln' ).html( "" );
    t.$( '.name' ).data( 'id', "" );
    t.$( '#stdimg' ).attr( 'src', "" );

    $( '#deleteStudentModal' ).modal( 'hide' );

//-------------------------------------------------------------------
  },


  /*
   * #DASHBOARD-PAGE  ::(CLICK)::
   */
  'click #dashboard-page'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
//-------------------------------------------------------------------
  },

});


/**
 * Get the parent template instance
 * @param {Number} [levels] How many levels to go up. Default is 1
 * @returns {Blaze.TemplateInstance}
 *
 * Example usage: someTemplate.parentTemplate() to get the immediate parent
 */
Blaze.TemplateInstance.prototype.parentTemplate = function (levels) {
    var view = this.view;
    if (typeof levels === "undefined") {
        levels = 1;
    }
    while (view) {
        if ( view.name.substring(0, 9) === "Template." && !( levels-- ) ) {
            return view.templateInstance();
        }
        view = view.parentView;
    }
};


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};