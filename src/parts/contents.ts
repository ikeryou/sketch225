
import { Func } from "../core/func";
import { Mouse } from "../core/mouse";
import { MyDisplay } from "../core/myDisplay";
import { Tween } from "../core/tween";
import { Point } from "../libs/point";
import { Util } from "../libs/util";
import { Segment } from "./segment";

// -----------------------------------------
//
// -----------------------------------------
export class Contents extends MyDisplay {

  private _segment:Array<Segment> = [];
  private _nowSegment:Segment | undefined;
  private _mouse:Point = new Point();
  private _isConnect:boolean = true;

  constructor(opt:any) {
    super(opt)

    const sw = Func.instance.sw();
    const sh = Func.instance.sh();

    this._mouse.x = sw * 0.5;
    this._mouse.y = sh * 0.5;

    // const num = 20
    // for(let i = 0; i < num; i++) {
    //   const el = document.createElement('div')
    //   el.classList.add('item')
    //   this.getEl().append(el);
    //   const item = new Segment({
    //     el:el,
    //     id:i,
    //   })
    //   this._segment.push(item);

    //   item.setPos(this._mouse.x, this._mouse.y);
    // }

    document.querySelector('.l-drag')?.addEventListener('click', () => {
      this._addSegment();
    })

    window.addEventListener('keypress', (e:KeyboardEvent) => {
      console.log(e.code)
      if(e.code == 'KeyA') {
        this._nowSegment = undefined;
        this._isConnect = false;
      }
      if(e.code == 'KeyS') {
        document.querySelector('.l-guide')?.classList.add('-hide');
      }
    })

    this._resize();
  }


  private _addSegment(): void {
    let mx = Mouse.instance.x;
    let my = Mouse.instance.y;

    // if(!this._isConnect) {
    //   this._nowSegment = undefined;
    //   this._isConnect = true;
    //   return;
    // }

    if(this._isConnect && this._segment.length > 0) {
      mx = this._segment[this._segment.length - 1].getPin().x;
      my = this._segment[this._segment.length - 1].getPin().y;
    }

    const el = document.createElement('div')
    el.classList.add('item')
    this.getEl().append(el);
    const item = new Segment({
      el:el,
      id:this._segment.length,
    })
    this._segment.push(item);

    this._nowSegment = item;
    this._isConnect = true;

    item.setPos(mx, my);
  }


  protected _update(): void {
    super._update();

    const mx = Mouse.instance.x;
    const my = Mouse.instance.y;

    if(this._nowSegment != undefined) {
      const x = this._nowSegment.getPos().x;
      const y = this._nowSegment.getPos().y;

      const dx = mx - this._nowSegment.getPos().x;
      const dy = my - this._nowSegment.getPos().y;

      const radian = Math.atan2(dy, dx); // ラジアン
      this._nowSegment.setRot(Util.instance.degree(radian)); // 度に変換

      Tween.instance.set(this._nowSegment.getEl(), {
        x:x,
        y:y,
        rotationZ:this._nowSegment.getRot()
      })
    }
  }
}