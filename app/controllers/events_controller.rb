class EventsController < ApplicationController

  def new
    @event = Event.new
    # form_newを文字列に変換して送る
    render plain: render_to_string(partial: 'form_new', layout: false, locals: { event: @event })
  end

  def create
    @event = Event.new(event_params)
    if @event.save
      redirect_to events_path
    end
  end

  def index
    @events = Event.all
  end

  def show
    @event = Event.find(params[:id])
  end

  def update
    event = Event.find(params[:id])
    if event.update(start: params[:start])
      redirect_to events_path
    else
      @events = Event.all
      render 'index'
    end
  end



  private

  def event_params
    params.require(:event).permit(:title, :start, :finish)
  end
end

