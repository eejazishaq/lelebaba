import { Directive, Input, ElementRef, Renderer } from '@angular/core';


@Directive({
  selector: '[hide-tool]', // Attribute selector
  host: {
    '(ionScroll)': 'onContentScroll($event)'
  }
})
export class HideToolDirective {

  @Input("tool") tool: HTMLElement;
  toolHeight;
  scrollContent;

  constructor(public element: ElementRef, public renderer: Renderer) {

    console.log('Hello HideToolDirective Directive');
  }

  ngOnInit(){
    this.toolHeight = this.tool.clientHeight;
    this.renderer.setElementStyle(this.tool, 'webkitTransition', 'top 700ms');
    this.scrollContent = this.element.nativeElement.getElementsByClassName("scroll-content")[0];
    this.renderer.setElementStyle(this.scrollContent, 'webkitTransition', 'margin-top 700ms');
  }

  onContentScroll(event){
    if(event.scrollTop > 56){
      this.renderer.setElementStyle(this.tool, "top", "-56px")
      this.renderer.setElementStyle(this.scrollContent, "margin-top", "0px")
    } else {
      this.renderer.setElementStyle(this.tool, "top", "0px");
      this.renderer.setElementStyle(this.scrollContent, "margin-top", "56px")
    }
  }

}
