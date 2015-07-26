$(function() {
  $('[data-toggle="tooltip"]').tooltip();

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
