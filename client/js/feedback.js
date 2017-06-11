$(document).ready(function() {
	var feedbackTemplate = Handlebars.compile($("#feedback-template").html());
  var nextUrl = "/api/feedback/getPart?page=0";

	$("#send-feedback").click(function() {
		$.post('/api/feedback/create', {
				title: $('#feedback-title').val(),
				content: $('#feedback-content').val()
			},
			function(data, status) {
				if (!data.status) {
					if (data.message.length) {
						toastr.error(data.message);
					} else {
						toastr.error('Feedback thất bại');
					}
				} else {
					toastr.success('Feedback thành công');
					$('#feedback-title').val("");
					$('#feedback-content').val("");
				}
			})
	});

	$("#get-feedback").click(function() {
		$("#get-feedback").hide();
		$("#feedback-load").show();
		loadNewFeedbackPage();
	});

	$("#feedback-load").click(function() {
		loadNewFeedbackPage();
	});

	function loadNewFeedbackPage() {
		$("#feedback-load").html('<i class="fa fa-spinner fa-spin"></i> Loading');
		$.ajax({
			method: "get",
			url: nextUrl
		}).then(function(data) {
      nextUrl = data.result.nextUrl;
	    if (nextUrl == "") $("#feedback-load").hide();

			data.result.feedbacks.forEach(function(feedback) {
				feedback.createdAt = new Date(feedback.createdAt);
				feedback.createdAt = feedback.createdAt.getDate() + "-" +
					(feedback.createdAt.getMonth() + 1) + "-" +
					feedback.createdAt.getFullYear();
			});
			var listFeedback = feedbackTemplate(data.result);
			$('#all-feedback').append($(listFeedback));

		}).fail(function(err) {
		}).always(function () {
      isLoading = false;
			$("#feedback-load").html("Load more");
    });
	}
})
