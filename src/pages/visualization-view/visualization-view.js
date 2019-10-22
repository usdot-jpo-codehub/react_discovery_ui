import React, {useState} from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { generatePath } from 'react-router'

import './visualization-view.scss'

import SaveIndicator from '../../components/generic-elements/save-indicator'
import ChartIcon from '../../components/generic-elements/chart-icon'
import SQLIcon from '../../components/generic-elements/sql-icon'
import TabButton from '../../components/generic-elements/tab-button'
import AutoAnchoringPopover from '../../components/generic-elements/auto-anchoring-popover'
import ErrorComponent from '../../components/generic-elements/error-component'

import SaveIcon from '@material-ui/icons/Save'
import ChartView from '../chart-view'
import QueryView from '../query-view'
import routes from '../../routes'

const VisualizationView = (props) => {
  const {
    reset,
    load,
    save,
    id: idFromState,
    query,
    isLoadFailure,
    isSaving,
    isSaveSuccess,
    isSaveFailure,
    isSaveable,
    match: {params: {id: idFromUrl}},
    history
  } = props

  const linkUrl = idFromState && generatePath(routes.visualizationView, {id: idFromState})
  const [isDialogOpen, setDialogOpen] = useState(false)

  React.useEffect(() => { reset() }, [])
  React.useEffect(() => { if (idFromUrl) load(idFromUrl) }, [idFromUrl])
  React.useEffect(() => { if (idFromState) history.push(linkUrl) }, [idFromState])

  const handleSave = () => { setDialogOpen(true); save('Placeholder Title', query) }
  const closeDialog = () => { setDialogOpen(false) }

  if (isLoadFailure) {
    return (
      <visualization-view>
        <ErrorComponent errorText='We were unable to load the requested visualization' />
      </visualization-view>
    )
  }

  const startIndex = idFromUrl ? 0 : 1

  return (
    <visualization-view>
      <Tabs defaultIndex={startIndex}>
        <TabList className='header'>
          <span className='tab-area'>
            <Tab className='header-item tab' selectedClassName='selected'>
              Visualize <ChartIcon className='chart-icon' />
            </Tab>
            <Tab className='header-item tab' selectedClassName='selected'>
              Write SQL <SQLIcon className='sql-icon' />
            </Tab>
          </span>
          <span className='action-area'>
            <React.Fragment>
              <TabButton disabled={!isSaveable} className={`header-item save-button ${isDialogOpen && 'saving'}`} onClick={handleSave} >
                <div title='Save Visualization'><SaveIcon /></div>
              </TabButton>
              <AutoAnchoringPopover className='popover-anchor' open={isDialogOpen} onClose={closeDialog} classes={{ paper: 'popover', root: 'popover-root' }} >
                <SaveIndicator saving={isSaving} success={isSaveSuccess} failure={isSaveFailure} linkUrl={linkUrl} />
              </AutoAnchoringPopover>
            </React.Fragment>
          </span>
        </TabList>
        <TabPanel>
          <ChartView />
        </TabPanel>
        <TabPanel>
          <QueryView />
        </TabPanel>
      </Tabs>
    </visualization-view>
  )
}
export default VisualizationView