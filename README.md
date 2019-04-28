# easy-transition

React 实现的动画组件。

## Install

```bash
$ npm i easy-transition
```

## Demo

```jsx
import React, {Component} from "react";
import ReactDOM from "react-dom";
import Transition from "easy-transition";

const status = Transition.Status;

export default class App extends Component {

    state = {
        isIn : true
    };

    render() {
        const {isIn} = this.state;
        return (
            <div>
                <Transition in={isIn} appear={true} timeout={300} unmountOnExit={false}>
                    <MyComponent text={isIn?"我出现了":"我隐藏了"}/>
                </Transition>

                <button onClick={()=>{
                    this.setState({
                        isIn: !isIn
                    })
                }}>button</button>
            </div>
        )
    }
}

class MyComponent extends Component {

    componentDidMount() {
        this.rect = ReactDOM.findDOMNode(this).getBoundingClientRect();
    }

    render() {
        const {text} = this.props;
        const style = this.getStyle();
        return (
            <div style={style}>{text}</div>
        )
    }

    getStyle() {
        const style = {};
        const {transitionStatus} = this.props;
        style.overflow = 'hidden';
        switch (transitionStatus) {
            case status.enter:
                style.height = 0;
                break;

            case status.entering:
                style.height = this.rect.height;
                style.transitionProperty = 'all';
                style.transition = '0.3s';
                break;

            case status.entered:
                style.height = this.rect.height;
                break;

            case status.exit:
                style.height = this.rect.height;
                break;

            case status.exiting:
                style.height = 0;
                style.transitionProperty = 'all';
                style.transition = '0.3s';
                break;

            case status.exited:
                style.height = 0;
                break;
        }

        return style;
    }
}
```


## Update

| 版本  | 更新内容       |
| ----- | -------------- |
| 0.1.0 | 实现基础功能。 |