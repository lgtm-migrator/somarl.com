import pluginManager, { Plugin, PluginAction, PluginActionOption } from '../plugins/draft'
import PluginPlugin from '../plugins/plugin'


class PluginActionTest extends PluginAction {
  public constructor (plugin: Plugin) {
    super(
      plugin,
      'test',
      'for ci'
    )
    this.register('--param', 'the testing param', 'default')
    this.alias('--param', '-p')
  }

  public exec (options: PluginActionOption[]) {
    let ret = ''
    for (const option of options) {
      if (option.name === '--param') {
        ret = option.value
      }
    }
    return ret
  }
}


it('exec plugin commands properly', () => {
  pluginManager.register('plugin', new PluginPlugin(pluginManager))

  const spm = pluginManager.getPlugin('plugin')
  if (!spm) throw Error('failed to register the plugin')

  spm.register(new PluginActionTest(spm))

  expect(spm.exec('test')).toBe('default')
  expect(spm.exec('test', '--param success')).toBe('success')
})
