
const template = document.createElement('template');
template.innerHTML = `
  <div>
    <h1> Time Element</h1>
  <div>
`
export default class RadialTimeSelector extends HTMLElement{
  constructor(){
    super();

    // internal state variables

  }

  connectedCallback(){
    let shadowRoot = this.attachShadow({mode:'open'})

    // get the height and width of the containing element
    console.log(this.getMaxDim())

    // clone the template
    let instance = template.content.cloneNode(true)
    shadowRoot.appendChild(instance)
  }

  render(){
    console.log("thigns");
  }

  getMaxDim(){
    // get the height and width of the containing element
    const boundingRect = this.getBoundingClientRect();
    const maxDimJs = Math.max(boundingRect.width, boundingRect.height)
    const maxDimCss = Math.max(this.style.height, this.style.width);

    return{
      'javascript' : maxDimJs,
      'css' : maxDimCss
    }
  }
}

