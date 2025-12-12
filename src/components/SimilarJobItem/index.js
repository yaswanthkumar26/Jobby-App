import {BsStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import './index.css'

const SimilarJobItem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = jobDetails

  return (
    <li className="similar-job-item">
      <div className="company-logo-container">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="company-logo"
        />
        <div>
          <h1 className="job-title">{title}</h1>
          <div className="rating-container">
            <BsStarFill className="star-icon" />
            <p className="rating-text">{rating}</p>
          </div>
        </div>
      </div>
      <h1 className="description-heading">Description</h1>
      <p className="job-description">{jobDescription}</p>
      <div className="location-type-container">
        <div className="location-container">
          <MdLocationOn />
          <p className="location-text">{location}</p>
        </div>
        <div className="employment-type-container">
          <BsBriefcaseFill />
          <p className="employment-type-text">{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobItem
