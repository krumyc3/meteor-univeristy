
/**
 * Main Pages
 */
FlowRouter.route( '/', {
  name: 'home',
  action: () =>
    BlazeLayout.render( 'layout', {top: "header", main: "home", bottom: "footer" } )
});

FlowRouter.route( '/overview', {
  name: 'overview',
  action: () =>
    BlazeLayout.render( 'layout', {top: "header", main: "overview", bottom: "footer"} )
});

FlowRouter.route( '/pricing', {
  name: 'pricing',
  action: () =>
    BlazeLayout.render( 'layout', {top: "header", main: "pricing", bottom: "footer"} )
});

FlowRouter.route( '/login', {
  name: 'login',
  action: () =>
    BlazeLayout.render( 'plain', {main: "login"} )
});

FlowRouter.route( '/signup', {
  name: 'signup',
  action: () =>
    BlazeLayout.render( 'layout', { top: "header", main: "signup", bottom: "footer"})
});

FlowRouter.route( '/post-signup', {
  name: 'post-signup',
  action: () =>
    BlazeLayout.render( 'layout', {top: "header", main: "postSignup", bottom: "footer"})
});

/*
FlowRouter.route( '/verify-email/:token', {
  name: 'verify-email',
  action( params ) {
    Accounts.verifyEmail( params.token, ( error ) =>{
      if ( error ) {
        console.log( error.reason, 'danger' );
      } else {
        
        //TODO: Display success page with temporary password
        //TODO: create user settings, incl passwoed change
        
        console.log( params.token );
        console.log(Meteor.user().emails[0].verified)
       // FlowRouter.go( '/' );
        console.log( 'Email verified! Thanks!', 'success' );
      }
    });
  }
});
*/

/**
 * STUDENT ROUTES
 */
let studentRoutes = FlowRouter.group({
  prefix: '/student',
  name: 'student',
  triggersEnter: [function( context, redirect ) {
    console.log( 'running student group triggers' );
  }]
});

studentRoutes.route( '/dashboard/:_id', {
  name: 'student-dashboard',
  action: () =>
    BlazeLayout.render( 'studentDashboardLayout', {main: "studentDashboard"}),
  triggersEnter: [function( context, redirect ) {
    console.log( 'running student dashboard trigger' );
  }]
});

studentRoutes.route( '/dashboard/courses/:_id', {
  name: 'student-courses',
  action: () =>
    BlazeLayout.render( 'studentDashboardLayout', {main: "studentCourseListing" })
});

studentRoutes.route( '/dashboard/request-credit/:_id', {
  name: 'student-request-credit',
  action: () =>
    BlazeLayout.render( 'studentDashboardLayout', {main: "studentRequestCredit" })
});

studentRoutes.route( '/dashboard/student-records/:_id', {
  name: 'student-records',
  action: () =>
    BlazeLayout.render( 'studentDashboardLayout', {main: "studentRecords" })
});

studentRoutes.route( '/dashboard/student-training-calendar/:_id', {
  name: 'student-training-calendar',
  action: () =>
    BlazeLayout.render( 'studentDashboardLayout', {main: "studentTrainingCalendar" })
});


/**
 * ADMIN ROUTES
 */

/* ADMIN ROUTE GROUP */
let adminRoutes = FlowRouter.group({
  prefix: '/admin',
  name: 'admin',
  triggersEnter: [function( context, redirect ) {
    console.log( 'running admin group triggers' );
  }]
});

/* ADMIN Dashboard */
adminRoutes.route( '/dashboard/:_id', {
  name: 'admin-dashboard',
  action: () =>
    BlazeLayout.render( 'adminDashboardLayout', {main: "adminDashboard"} ),
  triggersEnter: [function( context, redirect ) {
    //console.log( 'running /admin/dashboard trigger' );
  }]
});


/**
 * COURSES GROUP
 */

/* COURSES */
adminRoutes.route('/dashboard/courses/:_id', {
  name: 'admin-courses',
  action: () =>
    BlazeLayout.render( 'adminDashboardLayout', {main: "courses"})
});

/* ADD FROM LIBRARY */
adminRoutes.route('/dashboard/courses/add-from-library/:_id', {
  name: 'admin-add-from-library',
  action: () =>
    BlazeLayout.render( 'adminDashboardLayout', {main: "library"})
});

/* COURSE-BUILDER */
adminRoutes.route('/dashboard/course-builder/:_id', {
  name: 'admin-course-builder',
  action: () =>
    BlazeLayout.render( 'courseBuilderLayout', {main:"courseBuilderPage"})
});

/*
 * COURSE-VIEWER
 */
adminRoutes.route('/dashboard/course-viewer/:id', {
  name: 'admin-course-viewer',
  action: () =>
    BlazeLayout.render( 'courseViewerLayout', {main:"courseViewer"})
});

/* TEST-CREATOR */
adminRoutes.route('/dashboard/test-maker/:_id', {
  name: 'admin-test-creator',
  action: () =>
    BlazeLayout.render( 'courseBuilderLayout', {main:"adminTestCreator"})
});



/**
 * STUDENTS GROUP
 */

/* STUDENTS */
adminRoutes.route('/dashboard/students/:_id', {
  name: "admin-students",
  action: ( params, queryParams ) =>
    BlazeLayout.render( 'adminDashboardLayout', {main: "adminStudents"})
});

/* STUDENT-RECORD */
adminRoutes.route('/dashboard/students/student-record/:_id', {
  name: "student-record",
  action: () =>
    BlazeLayout.render( 'adminDashboardLayout', {main: "studentRecord"})
});

/* IMPORT CSV */
adminRoutes.route('/dashboard/students/import-csv/:_id', {
  name: 'admin-import-csv',
  action: () =>
    BlazeLayout.render('adminDashboardLayout', {main: "importCV"})
});


/**
 * DEGREES & CERTS GROUP
 */

/* DEGREES & CERTIFICATIONS */
adminRoutes.route('/dashboard/degrees-and-certifications/:_id', {
  name: 'admin-degrees-and-certifications',
  action: () =>
    BlazeLayout.render('adminDashboardLayout', {main: "degreeCertificate"})
});

/* DEGREES */
adminRoutes.route('/dashboard/degrees-and-certifications/degrees/:_id', {
  name: 'admin-degrees',
  action: () =>
    BlazeLayout.render('adminDashboardLayout', {main: "degrees"})
});

/* CERTIFICATIONS */
adminRoutes.route('/dashboard/degrees-and-certifications/certifications/:_id', {
  name: 'admin-certifications',
  action: () =>
    BlazeLayout.render('adminDashboardLayout', {main: "certs"})
});


/**
 * ASSIGN COURSES
 */
adminRoutes.route('/dashboard/assign-courses/:_id', {
  name: 'admin-assign-courses',
  action: () =>
    BlazeLayout.render( 'adminDashboardLayout', {main: "assignCourses"})
});


/**
 * ANALYTICS
 */
 adminRoutes.route('/dashboard/analytics/:_id', {
   name: 'admin-analytics',
   action: () =>
    BlazeLayout.render( 'adminDashboardLayout', {main: 'analytics'})
 });


/**
 * DESIGN
 */
 adminRoutes.route('/dashboard/design/:_id', {
   name: 'admin-design',
   action: () =>
    BlazeLayout.render( 'adminDashboardLayout', {main: 'adminDesign'})
 });


/**
 * ADVANCED
 */
 adminRoutes.route('/dashbaord/advanced/:_id', {
   name: 'admin-advanced',
   action: () =>
    BlazeLayout.render( 'adminDashboardLayout', {main: 'adminAdvanced'})
 });
 
  FlowRouter.route( '/verify-email/:token', {
    name: 'verify-email',
    action( params ) {
      Accounts.verifyEmail( params.token, ( error ) =>{
        if ( error ) {
          Bert.alert( error.reason, 'danger' );
        } else {
          FlowRouter.go( '/' );
          Bert.alert( 'Email verified! Thanks!', 'success' );
        }
      });
    }
  });