var properties = ['is_answered',	'score',	'creation_date',	'question_id',	'link',	'title',	'owner_name'];

var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;

    // an array that will be populated with substring matches
    matches = [];

    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        matches.push(str);
      }
    });

    cb(matches);
  };
};

$(function() {
  $('[data-toggle="tooltip"]').tooltip();

  $('.typeahead').typeahead(
    {
      hint: true,
      highlight: true,
      minLength: 1
    },
    {
      name: 'properties',
      source: substringMatcher(properties)
    }
  );

  var myModal = $('#myModal');

  myModal.on('show.bs.modal', function (e) {
    clearTimeout(myModal.data('hideInteval'));
    var hideInteval = setTimeout(function(){
        myModal.modal('hide');
    }, 1100);
    myModal.data('hideInteval', hideInteval);
  });

  $('#btn-persist').click(function() {
    $.ajax({
      url: 'v1/persist',
      method: 'GET',
      dataType: 'text',
      success: function(response) {
        $('#modalText').removeClass('text-danger').addClass('text-success').html('<strong>Dados persistidos com sucesso.</strong>');
        myModal.modal('show');
      },
      fail: function(err) {
        $('#modalText').removeClass('text-success').addClass('text-danger').html('<strong>Ocorreu um erro ao persistir os dados.</strong>');
        myModal.modal('show');
      }
    });
  });
});
