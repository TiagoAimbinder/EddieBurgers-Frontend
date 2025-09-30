import { Component, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-review.component.html',
  styleUrls: ['./modal-review.component.css']
})
export class ModalReviewComponent {

  @Input() Quest!: { askId: string, ask: string, text: string }; 
  @Output() Review = new EventEmitter<{ value: number, askId: string }>(); 

  public revSelected: WritableSignal<number> = signal(0); 

  public onSelect = (selected: number) => {
    if (selected === this.revSelected()) return; 
    this.revSelected.set(selected); 
  }

  public onSend = (val: number) => {
    this.revSelected.set(val);

    const obj: { value: number, askId: string } = {
      value: this.revSelected(),
      askId: this.Quest.askId,
    };
    
    this.revSelected.set(0);
    this.Review.emit(obj);

  }

  public onCancel = () => {
    const obj = { value: 0, askId: this.Quest.askId}
    this.Review.emit(obj);
  }
}
