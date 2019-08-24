
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



ko.components.register('progress-bar-yang',{
    viewModel:{ createViewModel:function(params,comonentInfo){
        return new BankingStats.Component.YangBarModel(params);
    }},
    template: $('#progressBarYang').html()
});


BankingStats.app = BankingStats.app || (function(){

    var me = this;

    me.init=function(){
      me.dailyGoal=ko.observable({calls:10,callsGoal:1000});   
      me.weeklyGoal=ko.observable({calls:20,callsGoal:1000});
      me.title=ko.observable("farge");
    
      ko.applyBindings(me,document.getElementById('main'));
      refreshData();
    }

    function refreshData(){
        $.ajax({url:"/data/stats.json"}).done(function(data){
            me.dailyGoal(data.daily);
            me.weeklyGoal(data.weekly);
        })
    }

    init();

    return me;
})();