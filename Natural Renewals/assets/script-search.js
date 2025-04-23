$(document).ready(function() {
    var results_text = '';
    if(search_results_count > 1 || search_results_count == 0){results_text  = 'results';}
    if(search_results_count == 1){results_text  = 'result';}

    $('#result_count').text(search_results_count + ' ' + results_text);

    var url = new URL(document.location.href);
    var q = url.searchParams.get("q");

    $('#q_search').text('\'' + q + '\'')
});