var EventListComponent = React.createClass({
  componentDidMount: function() {
    $('#events-calendar').fullCalendar({
      height: 'auto',

      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month, agendaWeek, agendaDay'
      },

      editable: true,
      selectable: true,
      selectHelper: true,

      select: function(start, end, event) {
        console.log(start)
        console.log(end)
        console.log(event)

        //$('#events-calendar').fullCalendar('renderEvent', {
          //title: 'hello world',
          //start: start,
          //end: end,
          //allDay: false
        //})

        $('#events-calendar').fullCalendar('unselect')
      }
    })

    var height = $('.header').innerHeight();

    $('.calendar-view').css('height', window.innerHeight - height - 50);

    //$('#events-calendar').fullCalendar('option', 'height', 'auto');
  },

  render: function() {
    return <div className="row">
      <div className="col-md-8 calendar-view">
        <div id="events-calendar"></div>
      </div>
      <div className="col-md-4">
        Stuff
      </div>
    </div>
  }
})

module.exports = EventListComponent;
