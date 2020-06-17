$(function () {
  function buildHTML(message) {
    if (message.image) {
      let html = `<div class="message" data-message-id=${message.id}>
                    <div class="message__upper-info">
                      <p class="message__upper-info__talker">
                        ${message.user_name}
                      </p>
                      <p class="message__upper-info__date">
                        ${message.created_at}
                      </p>
                    </div>
                    <div class="message__lower">
                      <p class="message__lower__content">
                        ${message.content}
                      </p>
                      <img class="message__lower__image" src=${message.image} >
                    </div>
                  </div>`;
      return html;
    } else {
      let html = `<div class="message" data-message-id=${message.id}>
                    <div class="message__upper-info">
                      <p class="message__upper-info__talker">
                        ${message.user_name}
                      </p>
                      <p class="message__upper-info__date">
                        ${message.created_at}
                      </p>
                    </div>
                    <div class="message__lower">
                      <p class="message__lower__content">
                        ${message.content}
                      </p>
                    </div>
                  </div>`;
      return html;
    }
  }
  $("#new_message").on("submit", function (e) {
    e.preventDefault();
    let formdata = new FormData(this);
    let uri = $(this).attr("action");
    $.ajax({
      uri: uri,
      type: "POST",
      data: formdata,
      dataType: "json",
      processData: false,
      contentType: false,
    })
      .done(function (data) {
        let html = buildHTML(data);
        $(".messages").append(html);
        $(".messages").animate({ scrollTop: $(".messages")[0].scrollHeight });
        $("#new_message")[0].reset();
      })
      .fail(function () {
        alert("メッセージ送信に失敗しました");
      })
      .always(function () {
        $(".submit-btn").prop("disabled", false);
      });
  });
  let reloadMessages = function () {
    let last_message_id = $(".message:last").data("message-id");
    $.ajax({
      url: "api/messages",
      type: "GET",
      dataType: "json",
      data: { id: last_message_id },
    })
      .done(function (messages) {
        if (messages.length !== 0) {
          let insertHTML = ``;
          $.each(messages, function (i, message) {
            insertHTML += buildHTML(message);
          });
          $(".messages").append(insertHTML);
          $(".messages").animate({ scrollTop: $(".messages")[0].scrollHeight });
        }
      })
      .fail(function () {
        alert("error");
      });
  };
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
});