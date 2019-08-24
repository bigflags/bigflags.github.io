
var BankingStats = BankingStats || {};
BankingStats.Component = BankingStats.Component || {};
BankingStats.Component.CID =0;

BankingStats.Component.YangBarModel = BankingStats.Component.YangBarModel  || function(params){
        var me=this,
        clipX =0,
        containerWidth=841,
        yangXOffset=-25;
        barWidth=800;

    var progressWidth=    (params.progress * barWidth)  ,
        yangX = yangXOffset + (params.progress * barWidth);

    if ( (params.progress*100) % 25 < 5) {
        progressWidth+=36;
        yangX+=15;
       
    }

    //841 - 828
    //13 margin
    
    me.progressWidth=ko.observable( progressWidth   );
    me.clipX = ko.observable(clipX);
    me.yangX = ko.observable(yangX)

    me.barId = ko.observable('barClip' + ++BankingStats.Component.CID);

    me.barClipPath = ko.computed( function() {
        return 'url(#' + me.barId() + ')';
    });

}

BankingStats.Component.GoNoGoModel = BankingStats.Component.GoNoGoModel  || function(params){
    var me=this;
    console.log(JSON.stringify(params));
    var toExceed= params.goal * 1.2;
    var completed=params.current>=params.goal,
        exceeded=params.current>toExceed;

    me.current=ko.observable( setVisiblity(!completed));
    me.goal=ko.observable( setVisiblity(completed && !exceeded));
    me.exceeded=ko.observable( setVisiblity(exceeded));
 

    function setVisiblity(yes){
        return yes ? "visible" : "hidden"
    }
}

ko.components.register('gague-gonogo',{viewModel: function(params,comonentInfo){

    return  new BankingStats.Component.GoNoGoModel(params);
},
template:$('#gonogo').html()});

ko.components.register('progress-bar-yang',{
    viewModel:{ createViewModel:function(params,comonentInfo){
        return new BankingStats.Component.YangBarModel(params);
    }},
    template: $('#progressBarYang').html()
});


BankingStats.app = BankingStats.app || (function(){

    var me = this;

    me.init=function(){
      me.dailyCalls=ko.observable({current:10,goal:1000});   
      me.weeklyCalls=ko.observable({current:20,goal:1000});
      me.bankersOnboarded=ko.observable({current:20,goal:1000});
      me.mailingListSignups=ko.observable({current:20,goal:1000});
      me.dailyConversations=ko.observable({current:20,goal:1000});
      me.leadersByConversations=ko.observable([]);
      me.leadersByMinutes=ko.observable([]);


      ko.applyBindings(me,document.getElementById('main'));
      refreshData();
    }

    function refreshData(){
        $.ajax({url:"/data/stats.json"}).done(function(data){
            console.log("yah?");
            me.dailyCalls(data.dailyCalls);
            me.weeklyCalls(data.weeklyCalls);
            me.bankersOnboarded(data.bankersOnboarded);
            me.mailingListSignups(data.mailingListSignups);
            me.dailyConversations(data.dailyConversations);
            me.leadersByConversations(data.leadersByConversations);
            me.leadersByMinutes(data.leadersByMinutes);
        })
    }

    init();

    return me;
})();