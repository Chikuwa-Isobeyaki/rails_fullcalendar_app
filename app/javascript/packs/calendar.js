import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

document.addEventListener('turbolinks:load', function() {
  var calendarEl = document.getElementById('calendar');

  var calendar = new Calendar(calendarEl, {
    plugins: [ dayGridPlugin, interactionPlugin ],


    // フルカレンダー設定オプション
    locale: 'ja',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right:'dayGridMonth,dayGridWeek,dayGridDay',
    },
    timeZone: 'Asia/Tokyo',
    firstDay: 1,
    expandRows: true,
    stickyHeaderDates: true,
    buttonText: {
       today: '今日'
    },
    allDayText: '終日',
    height: "auto",
    events: '/events.json',
    editable: true,



    dateClick: function(info){

        //クリックした日付の情報を取得
        const year  = info.date.getFullYear();
        const month = (info.date.getMonth() + 1);
        const day   = info.date.getDate();

        $.ajax({
            type: 'GET',
            url:  '/events/new',
            // 引数resは受け取ったhtmlが入っている
        }).done(function (res) {
                // 成功処理
                // 受け取ったhtmlをさっき追加したmodalのbodyの中に挿入します
            $('.modal-body').html(res);

            //フォームの年、月、日を自動入力
            $('#event_start_1i').val(year);
            $('#event_start_2i').val(month);
            $('#event_start_3i').val(day);

            $('#event_end_1i').val(year);
            $('#event_end_2i').val(month);
            $('#event_end_3i').val(day);

            $('#modal').fadeIn();

        }).fail(function (result){

        // 失敗処理
        alert("データを取得できません");
        });
    },


    //表示されたイベントをクリックしたときのイベント
    eventClick: function(info){

      // 選択したイベントのIDを取得
      const id = info.event.id;

      $.ajax({
        type: 'GET', // HTTPメソッド
        url: '/events/' + id, // type(GET)でアクセスしたいURL
        data: { id: id,}, // urlに送りたいデータ
        dataType: 'json'  //データの型, textなどもある
      });
    },

    eventDrop: function(info){
      const id = info.event.id;
      const start = info.event.start;
      const form = document.forms.event;

      console.log(id);
      console.log(start);


      $.ajax({
        type: 'patch',
        url: '/events/' + id,
        data: { id: id, start: start, authenticity_token: form.authenticity_token.value },
        dataType: 'json'
      });
      calendar.render();
    },

    });

  calendar.render();
});