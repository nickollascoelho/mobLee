$(function() {
  var qTable = $('#questionsTable');
  var qJSON = $('#questionsJSON');

  $('input[type=radio][name=resultOption]').change(function() {
      if (this.value === 'json') {
          qTable.hide();
          qJSON.show();
      } else if (this.value === 'table') {
        qJSON.hide();
        qTable.show();
      }
  });

  $.ajax({
    url: 'v1/question' + window.location.search,
    method: 'GET',
    dataType: 'json',
    success: function(data) {
      qJSON.text(JSON.stringify(data, undefined, 2));
      generateTable(data.content);
      var lastUpdate = '<em>' + new Date(data.last_update) + ' <span title="Unix timestamp">('+ data.last_update +')</span></em>';
      $('#last_update').html(lastUpdate);
    },
    fail: function(err) {
      console.log(err);
    }
  });

  var generateTable = function(questions) {
    var html = '<thead><tr>';

    for (var prop in questions[0]) {
      html += '<th>' + prop + '</th>';
    }

    html += '</tr></thead><tbody>';

    questions.forEach(function(each) {
      html += '<tr>';

      for (var prop in each) {
        html += '<td>' + each[prop] + '</td>';
      }

      html += '</tr>';
    });

    qTable.append(html);
  };
});
