import React from 'react';
import Farm from './farm';
import Apple from './apple';
import Juice from './juice';
import Block from './block';
import './style/game.css';
import './style/juice.css';
import { API_URL } from './config';
import { handleResponse } from './helpers'; // imports json
import { Button } from 'react-bootstrap';

var months = 3; //modify


class Game extends React.Component{

  constructor(props) {
    super(props);

    var trial_per_block = 3; // modify this to change the number of trials per block

    /* fill in random colors .*/
    var BlockNb = months;
    var random_col=[];
    for (var j=0; j<BlockNb; j++){
      random_col[j]=[];
      for (var i=0; i<trial_per_block; i++){
        random_col[j][i] = Math.round(Math.random() * 7)+1
      };
    };

    // console.log("random_col made", random_col)

    /* data to be saved .*/
    var chosen_tree = Array(trial_per_block).fill().map(() => Array(6).fill(0));
    var chosen_apple_size = Array(trial_per_block).fill().map(() => Array(6).fill(0));
    var all_key_pressed = Array(trial_per_block).fill().map(() => Array(6).fill(0));
    var reaction_times = Array(trial_per_block).fill().map(() => Array(7).fill(0));

    this.state = {
      BlockNb: BlockNb,
      start_block: 1,
      disp_new_block: 0,
      disp_juice: 0,
      TrialNo: 1,
      TrialInBlockNo:1,
      SampleNo: 0,
      BlockNo: 1,
      block_info: {},
      tree_col:random_col,
      chosen_tree:chosen_tree,
      chosen_apple_size:chosen_apple_size,
      all_key_pressed: all_key_pressed,
      reaction_times: reaction_times,
      trial_per_block: trial_per_block,
      info_btn_counter: 0,
      }

    /* prevents page from going down when space bar is hit .*/
    window.addEventListener('keydown', function(e) {
      if(e.keyCode === 32 && e.target === document.body) {
        e.preventDefault();
      }
    });

    this.fetchBlock.bind(this);
  }

  fetchBlock(user_no_,block_no_){
    console.log("this state", this.state)
    var currentDate   = new Date();
    var BlockStartTime    = currentDate.toTimeString();

    var task_no = this.props.user_info.task_no;

    fetch(`${API_URL}/task/`+task_no+'/'+block_no_)
    .then(handleResponse)
    .then((data) => {
        // console.log("fetchBlock Tree posistion", "data", data.TreePositions)
        const block_info = {
          BlockNo             : data.BlockNo,
          Horizon             : data.Horizon,
          InitialSampleNb     : data.InitialSampleNb,
          InitialSamples_Size : data.InitialSamplesSize,
          InitialSamples_Tree : data.InitialSamplesTree,
          ItemNo              : data.ItemNo,
          TreePositions       : data.TreePositions,
          DisplayOrder        : data.DisplayOrder,
          Tree1FutureSize     : data.Tree1FutureSize,
          Tree2FutureSize     : data.Tree2FutureSize,
          Tree3FutureSize     : data.Tree3FutureSize,
          Tree4FutureSize     : data.Tree4FutureSize,
          TrialNo             : data.TrialNo,
          UnusedTree          : data.UnusedTree,
          timeout_duration    : 5000,
        }

        this.setState({
          start_block:0,
          disp_new_block:1,
          block_info: block_info,
          TrialNo: block_info.TrialNo[0],
          BlockStartTime: BlockStartTime,
        });
      })
  }

  sendBlock(user_no_,block_no_){

    var currentDate   = new Date();
    var BlockFinishTime    = currentDate.toTimeString();

    let trial_per_block = this.state.trial_per_block;
    let ind_block = block_no_-1;

    var subset_Horizon = this.state.block_info.Horizon.slice(0,trial_per_block);
    var subset_InitialSampleNb = this.state.block_info.InitialSampleNb.slice(0,trial_per_block);
    var subset_InitialSamples_Tree = this.state.block_info.InitialSamples_Tree.slice(0,trial_per_block);
    var subset_InitialSamples_Size = this.state.block_info.InitialSamples_Size.slice(0,trial_per_block);
    var subset_ItemNo = this.state.block_info.ItemNo.slice(0,trial_per_block);
    var subset_TrialNo = this.state.block_info.TrialNo.slice(0,trial_per_block);
    var subset_UnusedTree = this.state.block_info.UnusedTree.slice(0,trial_per_block);
    var subset_TreePositions = this.state.block_info.TreePositions.slice(0,trial_per_block);

    let behaviour = {       'BlockNo'             : block_no_,
                            'Date'                : this.props.user_info.date,
                            'UserStartTime'       : this.props.user_info.startTime,
                            'ProlificID'          : this.props.user_info.prolific_id,
                            'TaskNo'              : this.props.user_info.task_no,
                            'TrainingNo'          : this.props.user_info.training_no,
                            'BlockStartTime'      : this.state.BlockStartTime,
                            'BlockFinishTime'     : BlockFinishTime,
                            'TreeColours'         : this.state.tree_col[ind_block],
                            'InfoRequestNo'       : this.state.info_btn_counter,
                            'ChosenTree'          : this.state.chosen_tree,
                            'ChosenAppleSize'     : this.state.chosen_apple_size,
                            'AllKeyPressed'       : this.state.all_key_pressed,
                            'ReactionTimes'       : this.state.reaction_times,
                            'Horizon'             : subset_Horizon,
                            'ItemNo'              : subset_ItemNo,
                            'TrialNo'             : subset_TrialNo,
                            'UnusedTree'          : subset_UnusedTree,
                            'InitialSamplesNb'    : subset_InitialSampleNb,
                            'InitialSamplesTree'  : subset_InitialSamples_Tree,
                            'InitialSamplesSize'  : subset_InitialSamples_Size,
                            'TreePositions'       : subset_TreePositions}

    fetch(`${API_URL}/behaviour/` + user_no_ + `/` + block_no_, {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(behaviour)
     })

    //  console.log("sendBlock", "behaviour", JSON.stringify(behaviour)) 
    console.log("this state", this.state)

  }

  render() {

      var trialinblock_index = this.state.TrialInBlockNo-1;
      // console.log(this.state.BlockNo, this.state.BlockNb, this.state.BlockNo>this.state.BlockNb)
      if (this.state.BlockNo>this.state.BlockNb) {
        // console.log("finished", "blockNo :", this.state.BlockNo)
        document.addEventListener("keyup", this._handleKeyDownSpace);
        return <Block block_start_bg={this.props.user_info.block_start_bg} block_finish_bg={this.props.user_info.block_finish_bg} block_i={this.state.BlockNo} BlockNb={this.state.BlockNb}/>
        }

      else if (this.state.start_block===1) {
        //console.log("fetch data")
        var BlockNo = this.state.BlockNo;
        this.fetchBlock(this.props.UserNo, BlockNo);
        return null
        }

      else if (this.state.disp_new_block===1) {
        document.removeEventListener("keyup", this._handleKeyDownTree);
        document.addEventListener("keyup", this._handleKeyDownSpace);
        return <Block block_start_bg={this.props.user_info.block_start_bg} block_finish_bg={this.props.user_info.block_finish_bg} block_i={this.state.block_info.BlockNo[trialinblock_index]} BlockNb={this.state.BlockNb}/>
      }

      else {
        this.listenner(trialinblock_index)
        switch(this.state.disp_juice) {
            case 0:

                var current_block = this.state.block_info.BlockNo[trialinblock_index];
                var col = this.state.tree_col[current_block-1][trialinblock_index];
                var hor = this.state.block_info.Horizon[trialinblock_index];
                var disp;
                // console.log("col", col)
                // console.log("hor", hor)
                // console.log("this.props", this.props)
                  switch(col) {
                      case 1:
                        disp = this.props.user_info.image_bg_1; break;
                      case 2:
                        disp = this.props.user_info.image_bg_2; break;
                      case 3:
                        disp = this.props.user_info.image_bg_3; break;
                      case 4:
                        disp = this.props.user_info.image_bg_4; break;
                      case 5:
                        disp = this.props.user_info.image_bg_5; break;
                      case 6:
                        disp = this.props.user_info.image_bg_6; break;
                      case 7:
                        disp = this.props.user_info.image_bg_7; break;
                      case 8:
                        disp = this.props.user_info.image_bg_8; break;
                      default:
                    }
                    // console.log("disp", disp)

                    return (
                      <div className="place-middle">
                        <div className="shift">
                          <Farm apples_picked={this.state.SampleNo} disp={disp} hor={hor}/>
                          {this.disp_current_apples(trialinblock_index)}
                          <div className="btn_help">
                            <Button variant="link" onClick={this.show_info}> Help </Button>
                          </div>
                        </div>
                      </div>
                    );


            case 1:
                return (this.disp_juice(trialinblock_index));
            default:
            }
        }
  }

  show_info = () => {

    this.setState({
      info_btn_counter: this.state.info_btn_counter+1,
    });

    alert("You need to produce as much juice as possible. The amount of juice is proportional to the sizes of apples you picked. Use the displayed information (apples on the wooden crate) to help you.")

  }

  disp_juice(trialinblock_index) {

    var mean_score=this.compute_score(trialinblock_index);
    var TrialNo = this.state.TrialNo;
    var trial_per_block = this.state.trial_per_block;
    var BlockNo = this.state.BlockNo;
    var TrialInBlockNo = this.state.TrialInBlockNo;
    var start_block = this.state.start_block;
    var chosen_tree;
    var chosen_apple_size;
    var all_key_pressed;
    var reaction_times;

    if(TrialNo%trial_per_block===0){
      this.sendBlock(this.props.UserNo, BlockNo);
    }

    if(TrialNo%trial_per_block===0){
      start_block = 1;
      TrialInBlockNo = 0;
      chosen_tree = Array(trial_per_block).fill().map(() => Array(6).fill(0));
      chosen_apple_size = Array(trial_per_block).fill().map(() => Array(6).fill(0));
      all_key_pressed = Array(trial_per_block).fill().map(() => Array(6).fill(0));
      reaction_times = Array(trial_per_block).fill().map(() => Array(7).fill(0));
      reaction_times[0][0] = Math.round(performance.now())+500;
      BlockNo++;
    }
    else{
      chosen_tree = this.state.chosen_tree;
      chosen_apple_size = this.state.chosen_apple_size;
      all_key_pressed = this.state.all_key_pressed;
      reaction_times = this.state.reaction_times;
      reaction_times[trialinblock_index+1][0] = Math.round(performance.now())+500;
    }

    TrialNo++;
    TrialInBlockNo++;

    setTimeout(
      function() {
        this.setState({
          reaction_times: reaction_times,
          disp_juice:0,
          TrialNo: TrialNo,
          TrialInBlockNo: TrialInBlockNo,
          SampleNo: 0,
          start_block: start_block,
          chosen_tree: chosen_tree,
          chosen_apple_size: chosen_apple_size,
          all_key_pressed: all_key_pressed,
          BlockNo: BlockNo,
        });
      }
      .bind(this),
      1000
    );

    var image_juice;
    var shift_mean_score = mean_score - 1; // shift size (2,10) to (1,9)
    var ind_mean_score = shift_mean_score - 1;
    var hor = this.state.block_info.Horizon[trialinblock_index];


    if (hor===1) {
      image_juice = this.props.user_info.juice_small_bg[ind_mean_score];
    }
    else if (hor===6) {
      image_juice = this.props.user_info.juice_big_bg[ind_mean_score];
    }

    return (
      <div className="place-middle">
        <Juice image_juice={image_juice} mean_score={shift_mean_score} hor={hor}/>
      </div>
    );

   }

  pick_apple(tree, key_pressed, time_pressed) {

    var trialinblock_index = this.state.TrialInBlockNo-1;

    var Tree1FutureSize = this.state.block_info.Tree1FutureSize[trialinblock_index];
    var Tree2FutureSize = this.state.block_info.Tree2FutureSize[trialinblock_index];
    var Tree3FutureSize = this.state.block_info.Tree3FutureSize[trialinblock_index];
    var Tree4FutureSize = this.state.block_info.Tree4FutureSize[trialinblock_index];

    var all_key_pressed = this.state.all_key_pressed;
    var reaction_times = this.state.reaction_times;
    var chosen_tree = this.state.chosen_tree;
    var chosen_apple_size = this.state.chosen_apple_size;

    var SampleNo = this.state.SampleNo;

    SampleNo++;

    reaction_times[trialinblock_index][SampleNo] = time_pressed;
    chosen_tree[trialinblock_index][SampleNo-1] = tree;
    all_key_pressed[trialinblock_index][SampleNo-1] = key_pressed;

    switch(tree) {
        case 1:
            chosen_apple_size[trialinblock_index][SampleNo-1]=Tree1FutureSize[SampleNo-1];
            break;
        case 2:
            chosen_apple_size[trialinblock_index][SampleNo-1]=Tree2FutureSize[SampleNo-1];
            break;
        case 3:
            chosen_apple_size[trialinblock_index][SampleNo-1]=Tree3FutureSize[SampleNo-1];
            break;
        case 4:
            chosen_apple_size[trialinblock_index][SampleNo-1]=Tree4FutureSize[SampleNo-1];
            break;
        default:
        }

      this.setState({
        all_key_pressed: all_key_pressed,
        chosen_tree: chosen_tree,
        chosen_apple_size: chosen_apple_size,
        SampleNo: SampleNo,
      });
    // console.log("this state", this.state)


    }

    disp_current_apples(trialinblock_index) {
      var InitialSampleNb = this.state.block_info.InitialSampleNb[trialinblock_index];
      var InitialSamples_Tree = this.state.block_info.InitialSamples_Tree[trialinblock_index];
      var InitialSamples_Size = this.state.block_info.InitialSamples_Size[trialinblock_index];
      var TreePositions = this.state.block_info.TreePositions[trialinblock_index];
      var Horizon = this.state.block_info.Horizon[trialinblock_index];
      var SampleNo = this.state.SampleNo;
      var chosen_tree = this.state.chosen_tree;
      var chosen_apple_size = this.state.chosen_apple_size;
  

      let all_boxes = [];
      let pos = [];
      let pos_c = [];
    
      // Populate pos array with positions for initial samples
      for (var i = 0; i < InitialSampleNb; i++) {
        pos.push(TreePositions[InitialSamples_Tree[i] - 1]);
      }

      for (i = 0; i < SampleNo; i++) {
        // Ensure the user selection is directly translated into pos_c without adjustments
        let chosenPosition = chosen_tree[trialinblock_index][i] - 1;

        console.log("Chosen position:", chosenPosition);
        console.log("this.state", this.state);
        // Directly push the tree position (1, 2, or 3) as selected by the user
        pos_c.push(TreePositions[chosenPosition]);
      }
    
      // Populate pos array with positions for chosen samples
      // for (i = 0; i < SampleNo; i++) {
      //   pos_c.push(TreePositions[chosen_tree[trialinblock_index][i] - 1]);
      // }
    
      // Adjust pos array to replace 0s with missing numbers
      console.log("Original pos:", pos);
      console.log("Original pos_c:", pos_c);
      pos = pos.map((p, index) => {
        if (p === 0 && index < 3) { // Apply adjustment only for the first three elements
          const missingNumbers = [1, 2, 3].filter(num => !pos.slice(0, 3).includes(num));
          return missingNumbers.length > 0 ? missingNumbers[0] : p; // Replace with the first missing number
        }
        return p;
      });

 
    
      console.log("Adjusted pos:", pos);
      console.log("Adjusted pos_c:", pos_c);
    
      // Use the adjusted pos array for rendering
      for (i = 0; i < InitialSampleNb; i++) {
        all_boxes.push(this.renderApple(InitialSamples_Size[i], pos[i]));
      }
      for (i = 0; i < SampleNo; i++) {
        all_boxes.push(this.renderApple(chosen_apple_size[trialinblock_index][i], pos_c[i]));
      }
      for (i=InitialSampleNb+SampleNo; i<InitialSampleNb+Horizon; i++) {
        // console.log("i", i , "its not printing it")
        all_boxes.push(this.renderApple('',''))
      }
    
      return all_boxes;
    }
    
    

  compute_score(trialinblock_index) {

      var chosen_apple_size = this.state.chosen_apple_size[trialinblock_index];
      var Horizon = this.state.block_info.Horizon[trialinblock_index];

      var sum = 0;

      for (var i=0; i<chosen_apple_size.length; i++){
        sum += parseInt(chosen_apple_size[i], 10);
      }

      var mean_score = Math.round(sum/Horizon);
      // console.log("mean_score", mean_score)
      return mean_score;
    }

  renderApple(val, tree_i){
          var trialinblock_index = this.state.TrialInBlockNo-1;
          var current_block_index = this.state.block_info.BlockNo[trialinblock_index]-1;
          var col=this.state.tree_col[current_block_index][trialinblock_index];
          var disp_col;

          switch(col) {
              case 1:
                disp_col = this.props.user_info.apple_col1;
                break;
              case 2:
                disp_col = this.props.user_info.apple_col2;
                break;
              case 3:
                disp_col = this.props.user_info.apple_col3;
                break;
              case 4:
                disp_col = this.props.user_info.apple_col4;
                break;
              case 5:
                disp_col = this.props.user_info.apple_col5;
                break;
              case 6:
                disp_col = this.props.user_info.apple_col6;
                break;
              case 7:
                disp_col = this.props.user_info.apple_col7;
                break;
              case 8:
                disp_col = this.props.user_info.apple_col8;
                break;
              default:
            }

          return <Apple value={val} tree={tree_i} disp_col={disp_col}/>;
        }

  listenner(trialinblock_index) {

    document.removeEventListener("keyup", this._handleKeyDownSpace)
    document.removeEventListener("keyup", this._handleKeyDownTree)

    let tmp_apples_picked = this.state.SampleNo;
    var tmp_apples_to_pick = this.state.block_info.Horizon[trialinblock_index];

    if (tmp_apples_picked < tmp_apples_to_pick){
      return document.addEventListener("keyup", this._handleKeyDownTree);
      }

    else {

      var disp_juice = this.state.disp_juice;

      if (disp_juice === 0){
        setTimeout(
          function() {
            this.setState({
              disp_juice:1,
              });
            }
            .bind(this),
            500
          );
        }
      }
    }

  _handleKeyDownTree = (event) => {

    var trialinblock_index = this.state.TrialInBlockNo-1;
    var DisplayOrder = this.state.block_info.DisplayOrder[trialinblock_index];
    var key_pressed;
    var time_pressed;

    switch( event.keyCode ) {
        case 97:
          key_pressed = 1;
          time_pressed = Math.round(performance.now());
          this.pick_apple(DisplayOrder[0], key_pressed, time_pressed);
          break;
        case 98:
          key_pressed = 2;
          time_pressed = Math.round(performance.now());
          this.pick_apple(DisplayOrder[1], key_pressed, time_pressed);
          break;
        case 99:
          key_pressed = 3;
          time_pressed = Math.round(performance.now());
          this.pick_apple(DisplayOrder[2], key_pressed, time_pressed);
          break;
        case 49:
          key_pressed = 1;
          time_pressed = Math.round(performance.now());
          this.pick_apple(DisplayOrder[0], key_pressed, time_pressed);
          break;
        case 50:
          key_pressed = 2;
          time_pressed = Math.round(performance.now());
          this.pick_apple(DisplayOrder[1], key_pressed, time_pressed);
          break;
        case 51:
          key_pressed = 3;
          time_pressed = Math.round(performance.now());
          this.pick_apple(DisplayOrder[2], key_pressed, time_pressed);
          break;
        default:
      }
  }

  _handleKeyDownSpace = (event) => {
    switch( event.keyCode ) {
        case 32:

        var trialinblock_index = this.state.TrialInBlockNo-1; // should be zero
        var reaction_times = this.state.reaction_times;
        var SampleNo = this.state.SampleNo;

        reaction_times[trialinblock_index][SampleNo] = Math.round(performance.now());
          // console.log(this.state.BlockNo, this.state.BlockNb, this.state.BlockNo>this.state.BlockNb)
          if (this.state.BlockNo>this.state.BlockNb) {
            this.props.nextTransition(1);
            document.removeEventListener("keyup", this._handleKeyDownSpace)
            document.removeEventListener("keyup", this._handleKeyDownSpace)
          }
          else {
            this.setState({
              disp_new_block: 0,
              reaction_times: reaction_times
            });
          }
            break;
        default:
      }
  }

};

export default Game;
