/**
 * Created by blues on 2019-04-28.
 */
import React, {Component} from "react";
import PropTypes from "prop-types";
import * as status from "./status";

export default class Transition extends Component {
    static propTypes = {
        in : PropTypes.bool,            //是否入场，默认false
        appear : PropTypes.bool,        //渲染的时候是否执行动画，默认true
        timeout : PropTypes.number,     //动画时间，默认300
        unmountOnExit : PropTypes.bool, //退出后是否移除dom，默认false
    };

    static defaultProps = {
        in : false,
        appear : true,
        timeout : 300,
        unmountOnExit : false
    };

    start(props) {
        const {in: inProp} = props;
        let transitionStatus = null;
        if(this.state){
            transitionStatus = this.state.transitionStatus;
        }

        if (inProp) {   //外部请求入场
            if (!transitionStatus){ //当前未安装，接下来准备安装
                this.doMount();
            }
            else{  //当前已安装，接下来执行入场
                this.doEnter();
            }
        }
        else{   //外部请求退场
            if (transitionStatus){ //当前已安装，接下来执行退场
                this.doExit();
            }
        }
    }

    constructor(props) {
        super(props);

        const {in: inProp} = this.props;

        this.state = {
            transitionStatus : inProp ? status.mount : null
        };
        this.timeId = 0;
    }

    componentDidMount() {
        this.start(this.props);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.start(nextProps);
    }

    render() {
        const {transitionStatus} = this.state;
        const {children} = this.props;
        // 子组件已经被卸载
        if (!transitionStatus) {
            return null;
        }

        const child = React.Children.only(children);
        const oldProps = child.props;
        const newProps = {
            transitionStatus : transitionStatus
        };
        const mergeProps = Object.assign({}, oldProps, newProps);
        return (
            React.cloneElement(child, mergeProps)
        )
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {transitionStatus: prevStatus} = this.state;
        const self = this;
        switch (prevStatus) {

            case status.mount:
                this.doEnter();
                break;

            case status.enter:
                setTimeout(()=>{
                    self.doEntering();
                }, 10);
                break;

            case status.exit:
                setTimeout(()=>{
                    self.doExiting();
                }, 10);
                break;

            case status.exited:
                this.tryUnmount();
                break;
        }
    }

    doMount(){
        clearTimeout(this.timeId);
        this.setState({
            transitionStatus : status.mount
        })
    }

    /**
     * 入场（子组件准备）
     */
    doEnter(){
        clearTimeout(this.timeId);
        const {transitionStatus} = this.state;

        if(transitionStatus === status.mount
            || transitionStatus === status.exited){  //退场结束了，需要重新准备，再播放入场动画
            this.setState({
                transitionStatus : status.enter
            });
        }
        else{
            this.doEntering();
        }
    }

    /**
     * 入场中（子组件播放入场动画）
     */
    doEntering(){
        clearTimeout(this.timeId);
        const {appear, timeout} = this.props;
        if(appear){ //允许播放动画
            this.setState({
                transitionStatus : status.entering
            });

            const self = this;
            this.timeId = setTimeout(()=>{
                self.doEntered();
            }, timeout);
        }
        else{
            this.doEntered();
        }
    }

    /**
     * 入场结束
     */
    doEntered(){
        this.setState({
            transitionStatus : status.entered
        });
    }

    /**
     * 退场（子组件准备）
     */
    doExit() {
        clearTimeout(this.timeId);
        const {transitionStatus} = this.state;

        if(transitionStatus === status.exited){  //退场结束了，无法重复退场
           return;
        }

        if(transitionStatus === status.entering
            || transitionStatus === status.exiting)
        { //子组件正在播放动画中，直接播放退场动画
            this.doExiting();
        }
        else {//子组件为接下来的退出动画做准备
            this.setState({
                transitionStatus : status.exit
            });
        }
    }

    /**
     * 退场（子组件播放退场动画）
     */
    doExiting() {
        clearTimeout(this.timeId);
        const {appear, timeout} = this.props;
        if(appear){//允许播放动画

            this.setState({
                transitionStatus : status.exiting
            });
            const self = this;
            this.timeId = setTimeout(()=>{
                self.doExited();
            }, timeout);
        }
        else{
            this.doExited();
        }
    }

    /**
     * 退场结束
     */
    doExited(){
        this.setState({
            transitionStatus : status.exited
        });
    }

    /**
     * 尝试卸载子组件
     */
    tryUnmount(){
        const {unmountOnExit} = this.props;
        if(unmountOnExit){
            this.setState({
                transitionStatus : null
            });
        }
    }
}