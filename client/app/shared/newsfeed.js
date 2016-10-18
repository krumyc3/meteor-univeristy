
/*
  Upon login:
    Check for viewable newsfeeds, and display
*/
import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import { Newsfeeds }    from '../../../both/collections/api/newsfeeds.js';
import { Comments  }    from '../../../both/collections/api/comments.js';
import { Students  }    from '../../../both/collections/api/students.js';

import '../../templates/shared/newsfeed.html';


/**
 * ON CREATED
 */
Template.newsfeed.onCreated(function(){
  
  Session.setDefault('active_click_id', '');
  
  $.getScript( '/js/notify.min.js', function() {
    $.notify.addStyle('happyblack', {
      html: '<div style="width:275px;height:100px;border-radius: 15px 50px;padding: 10px;opacity:0.75;border: 0.5px dashed LightGrey">' +
              '&nbsp;&nbsp;<span class="glyphicon glyphicon-ok"></span>' +
              '&nbsp;&nbsp;<span data-notify-text/>!</div>',
      classes: {
        base: {
          "white-space": "nowrap",
          "background-color": "DarkGrey",
          "padding": "5px"
        },
        superblack: {
          "color": "LightGrey",
          "background-color": "black"
        }
      }
    });
    //console.log('CourseBuilder:: notify.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'Assign-Courses:: load notify.min.js fail' );
  });
});



/**
 * ON DESTROYED
 */
Template.newsfeed.onDestroyed( function() {
  //re-set comment display limit(s)
  var nf = Newsfeeds.find({}, { comment_limit: {$ne: 3}}).fetch();
  for ( let n = 0; n < nf.length; n++ ) {
    Newsfeeds.update({ _id: nf[n]._id }, {$set:{ comment_limit: 3 }});
  };
});



/**
 * HELPERS
 */
Template.newsfeed.helpers({
  newsfeeds() {
    var owner = Meteor.userId(); //reactivevariable
    
    //var feed  = Newsfeeds.find({ owner_id: owner}, { sort: { date: -1 } }).fetch();
    let feed = Newsfeeds.find({ private: false }, { sort: { date: -1 } }).fetch(); //most recent at top

    for( let i = 0; i < feed.length; i++ ) {  
      var com = Comments.find({ owner_id: feed[i]._id }, { sort: { date: -1 } }).fetch(); //most recent at top   
      if( com.length > 0 ) {  
        feed[i].comments = [];

          if ( feed[i]._id == Session.get('active_click_id') ) {  //selected js-more button 
            var lim = feed[i].comment_limit;                      //get number of comments to display
            for( let l = 0; l < lim; l++ ) {    
              if ( l < com.length  ) {                            //if there is a comment
                feed[i].comments[l] = com[l];                     //add it
              }
            }
            if ( com.length > feed[i].comment_limit ) feed[i].com_length = true;  //more comments left?
          } else if ( feed[i]._id != Session.get('active_click_id') ) {
            for ( let k = 0; k < feed[i].comment_limit; k++ ) {    
              if ( k < com.length )                                               
                feed[i].comments[k] = com[k];
            }
            if ( com.length > feed[i].comment_limit ) feed[i].com_length = true;
          }
        }
      }
    return feed;
  },
  
  cur_user_avatar() {
    try {
      return Students.findOne({_id: Meteor.userId()}).avatar;
    } catch(e) {
      return;
    }
  }
  /*
  name() {
    return Meteor.user() && Meteor.user().username;
  },
  */
});



/**
 * EVENTS
 */
Template.newsfeed.events({
  
  /**
   * LIKE BUTTON
   */
  'click .js-like-button': _.debounce( function( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    var id = $(e.currentTarget).data( 'id' );

    //get this posts array of likers
    var res = Newsfeeds.find( { _id: id}, { likers: 1}).fetch()[0].likers;
    
    //see if the current user is one of them
    var boo = _.find(res, (x) => x == Meteor.userId() );

    //need to disallow same user that liked to like again
    if ( boo == Meteor.userId() ) return;
  
    //otherwise, allow like and save it
    Newsfeeds.update( { _id: id },  { $inc: { likes: 1 } ,  $push: { likers:  Meteor.userId() }  });
    
  }, 1000 ),
  
  
  /**
   * MORE BUTTON
   */
  'click .js-more':  _.debounce( function( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    //let my = e.currentTarget.parentNode.parentNode.parentNode
    //let myid = my.getAttribute('id')
    //console.log( e.currentTarget.parentElement );
    //console.log( e.currentTarget.parentElement.nodeName );
    
    
    Session.set('active_click_id', '');                 //clear actively clicked js-more
    // data-id is id of POST
    var master_id = $(e.currentTarget).data('id');      //get currently selected js-more
    Session.set('active_click_id', master_id );         //set selected js-more
    
    let myid = $(e.currentTarget).parent().prev().attr('id');             // get id of closest sibling comment
    
    let tempScrollTop = $('div#' + myid ).offset().top;                   // scroll top of that comment
    Newsfeeds.update( { _id: master_id }, { $inc: {comment_limit: 3} });  // add next 3 comments
    $(window).scrollTop(tempScrollTop);                                   // reposition scroll top

  }, 1000),


  /**
   * NEWS ITEM DELETE
   */
  'click #news-item-delete':  _.debounce( function( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    var i_d = $(e.currentTarget).data( 'id' );

    $( '#news-item-' + i_d ).hide();

    var owner = $( '#news-item-' + i_d ).data('id');

    if (Meteor.userId() !== owner ) return;

    Tracker.autorun( () => {
      Meteor.subscribe( 'deleteComments', i_d );
    });
    
    var d = Comments.find({ owner_id: i_d }).fetch();

    if ( d.length > 0 ) {
      for( let i = 0; i < d.length; i++ ) {
        Comments.remove({ _id: d[i]._id });
      }
    }
    Meteor.setTimeout(function() {
      Newsfeeds.remove({ _id: i_d  });
    }, 250);
    
    // NOTIFICATION
    $.notify(
      "\n\n\t\t\tThe post was deleted from your feed",
      {
      style: "happyblack",
      className: "superblack",
      globalPosition:"top center",
      autoHideDelay: 3000
      }
    );


  }, 1000),


  'keypress':  _.throttle( function( e, t ) {
    if ( e.keyCode === 13 ) {
      e.preventDefault();
      e.stopImmediatePropagation();
      
      var id = $(e.target).data( 'id' );
      $(e.target).css("outline", "#0000FF solid thick");

      var commentary = $(`#ta-${id}`).val().trim();

      if ( commentary === null || commentary === 'undefined' || commentary === "" ) {
        return;
      }

      //var rec = Newsfeeds.findOne({ _id: id }); //.fetch()[0];

      Meteor.setTimeout(function() {
        Comments.insert({ owner_id: id, 
                          poster_id: Meteor.userId(), 
                          poster_name: Meteor.user().username, 
                          poster_avatar: Meteor.user().profile.avatar,
                          comment: commentary, 
                          date: new Date() });
        $(`#ta-${id}`).val('');
      }, 100);

      $( e.target ).fadeOut( "slow", function() {
        // Animation complete.
        $(e.target).css("outline", "");
      }).fadeIn('slow');
    }
      //t.$('.js-comment-button').click();
  }, 1000),
 

  'click .js-comment-button':  _.debounce( function ( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    var id = $(e.currentTarget).data( 'id' );
    var commentary = $(`#ta-${id}`).val().trim();

    if ( commentary === null || commentary === 'undefined' || commentary === "" ) {
      return;
    }

    //var rec = Newsfeeds.findOne({ _id: id }); //.fetch()[0];
    
    Meteor.setTimeout(function() {
      Comments.insert({ owner_id: id, 
                        poster_id: Meteor.userId(), 
                        poster_name: Meteor.user().username, 
                        poster_avatar: Meteor.user().profile.avatar,
                        comment: commentary, 
                        date: new Date() });
      $(`#ta-${id}`).val('');
    }, 250);
  }, 1000)

});