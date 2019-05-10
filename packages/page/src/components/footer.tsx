import { h, Component } from 'preact'
import { getBinks } from '../helpers/Api'
import { HTTPStatusCodes } from '../helpers/Adapter'


export interface IFooterState {
  toggled: boolean
  binksName: S
  binksCopyright: S
}

export default class Footer extends Component<{}, IFooterState> {
  public readonly state: IFooterState = {
    toggled: true,
    binksName: '',
    binksCopyright: '',
  }

  public async componentDidMount () {
    const resp = await getBinks()
    if (resp.status === HTTPStatusCodes.OK) {
      this.setState({
        binksName: resp.body.image,
        binksCopyright: resp.body.copyright,
      })
    }
    this.setState({toggled: localStorage.getItem('footerToggled') === 'false'})
  }

  public readonly toggle = () => {
    localStorage.setItem('footerToggled', `${!this.state.toggled}`)
    this.setState((prev: any) => ({toggled: !prev.toggled}))
  }

  public render () {
    return (
      <footer className={`footer_toggle${this.state.toggled ? 'd' : ''}`}>
        <div className="absolute footer__widget" onClick={this.toggle} />
        <span className={`footer__image-info footer__image-info_${this.state.binksCopyright ? 'adequate' : 'simple'}`}>
          <span className="footer__image-info-name">"{this.state.binksName || 'Failed to load image'}"</span>
          <span className="footer__image-info-connect">&nbsp;-&nbsp;</span>
          <span className="footer__image-info-copyright">{this.state.binksCopyright}</span>
        </span>
        <span className="footer__copyright">© 2019 Sy. All rights reserved.</span>
      </footer>
    )
  }
}
