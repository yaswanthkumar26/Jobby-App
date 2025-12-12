import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'

import Header from '../Header'
import JobCard from '../JobCard'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    profileData: {},
    employmentType: [],
    salaryRange: '0',
    searchInput: '',
    profileApiStatus: apiStatusConstants.initial,
    jobsApiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  getProfile = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedProfileData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileData: updatedProfileData,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  getJobs = async () => {
    this.setState({jobsApiStatus: apiStatusConstants.inProgress})
    const {employmentType, salaryRange, searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType.join(
      ',',
    )}&minimum_package=${salaryRange}&search=${searchInput}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedJobsData = data.jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))
      this.setState({
        jobsList: updatedJobsData,
        jobsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobsApiStatus: apiStatusConstants.failure})
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobs()
    }
  }

  handleEmploymentTypeChange = event => {
    const {employmentType} = this.state
    const {value, checked} = event.target
    let newEmploymentType = [...employmentType]
    if (checked) {
      newEmploymentType.push(value)
    } else {
      newEmploymentType = newEmploymentType.filter(type => type !== value)
    }
    this.setState({employmentType: newEmploymentType}, this.getJobs)
  }

  handleSalaryRangeChange = event => {
    this.setState({salaryRange: event.target.value}, this.getJobs)
  }

  renderLoadingView = () => (
    <div className='loader-container' data-testid='loader'>
      <Loader type='ThreeDots' color='#ffffff' height='50' width='50' />
    </div>
  )

  renderProfileFailureView = () => (
    <div className='failure-view-container'>
      <button type='button' onClick={this.getProfile}>
        Retry
      </button>
    </div>
  )

  renderJobsFailureView = () => (
    <div className='failure-view-container'>
      <img
        src='https://assets.ccbp.in/frontend/react-js/failure-img.png'
        alt='failure view'
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type='button' onClick={this.getJobs}>
        Retry
      </button>
    </div>
  )

  renderProfileView = () => {
    const {profileData, profileApiStatus} = this.state

    switch (profileApiStatus) {
      case apiStatusConstants.success: {
        // <-- Added opening brace
        const {name, profileImageUrl, shortBio} = profileData
        return (
          <div className='profile-container'>
            <img src={profileImageUrl} alt='profile' />
            <h1 className='profile-name'>{name}</h1>
            <p className='profile-bio'>{shortBio}</p>
          </div>
        )
      }
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderJobsListView = () => {
    const {jobsList, jobsApiStatus} = this.state

    switch (jobsApiStatus) {
      case apiStatusConstants.success:
        return jobsList.length > 0 ? (
          <ul className='jobs-list'>
            {jobsList.map(job => (
              <JobCard jobData={job} key={job.id} />
            ))}
          </ul>
        ) : (
          <div className='no-jobs-view'>
            <img
              src='https://assets.ccbp.in/frontend/react-js/no-jobs-img.png'
              alt='no jobs'
            />
            <h1>No Jobs Found</h1>
            <p>We could not find any jobs. Try other filters.</p>
          </div>
        )
      case apiStatusConstants.failure:
        return this.renderJobsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className='jobs-page-container'>
          <div className='sidebar-container'>
            {this.renderProfileView()}
            <hr className='separator' />
            <h1 className='filter-heading'>Type of Employment</h1>
            <ul className='filter-list'>
              {employmentTypesList.map(eachType => (
                <li key={eachType.employmentTypeId}>
                  <input
                    type='checkbox'
                    id={eachType.employmentTypeId}
                    value={eachType.employmentTypeId}
                    onChange={this.handleEmploymentTypeChange}
                  />
                  <label htmlFor={eachType.employmentTypeId}>
                    {eachType.label}
                  </label>
                </li>
              ))}
            </ul>
            <hr className='separator' />
            <h1 className='filter-heading'>Salary Range</h1>
            <ul className='filter-list'>
              {salaryRangesList.map(eachRange => (
                <li key={eachRange.salaryRangeId}>
                  <input
                    type='radio'
                    id={eachRange.salaryRangeId}
                    name='salary'
                    value={eachRange.salaryRangeId}
                    onChange={this.handleSalaryRangeChange}
                  />
                  <label htmlFor={eachRange.salaryRangeId}>
                    {eachRange.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className='jobs-content-container'>
            <div className='search-input-container'>
              <input
                type='search'
                className='search-input'
                placeholder='Search'
                value={searchInput}
                onChange={this.onChangeSearchInput}
                onKeyDown={this.onEnterSearchInput}
              />
              <button
                type='button'
                data-testid='searchButton'
                className='search-button'
                onClick={this.getJobs}
              >
                <BsSearch className='search-icon' />
              </button>
            </div>
            {this.renderJobsListView()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
