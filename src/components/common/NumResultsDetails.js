export const NumResultsDetails = ({
  firstPageIsFetching,
  firstPageData,
  nextPageIsPending,
  nextPageIsFetching,
  searchResultsDisplayData,
  searchResultsAll,
  isDetails,
}) => (
  <>
    {!firstPageIsFetching && !nextPageIsFetching ? (
      <>
        {' '}
        showing{' '}
        <strong>
          {nextPageIsPending
            ? firstPageData?.Search?.length
            : searchResultsDisplayData?.length}
        </strong>{' '}
        of{' '}
        <strong>
          {firstPageData?.totalResults
            ? firstPageData?.totalResults
            : 0}
        </strong>{' '}
        results
      </>
    ) : (
      <>
        showing{' '}
        <svg
          width="22"
          height="12"
          viewBox="0 5 24 14"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="4" cy="12" r="0" fill="white">
            <animate
              begin="0;spinner_z0Or.end"
              attributeName="r"
              calcMode="spline"
              dur="0.5s"
              keySplines=".36,.6,.31,1"
              values="0;3"
              fill="freeze"
            />
            <animate
              begin="spinner_OLMs.end"
              attributeName="cx"
              calcMode="spline"
              dur="0.5s"
              keySplines=".36,.6,.31,1"
              values="4;12"
              fill="freeze"
            />
            <animate
              begin="spinner_UHR2.end"
              attributeName="cx"
              calcMode="spline"
              dur="0.5s"
              keySplines=".36,.6,.31,1"
              values="12;20"
              fill="freeze"
            />
            <animate
              id="spinner_lo66"
              begin="spinner_Aguh.end"
              attributeName="r"
              calcMode="spline"
              dur="0.5s"
              keySplines=".36,.6,.31,1"
              values="3;0"
              fill="freeze"
            />
            <animate
              id="spinner_z0Or"
              begin="spinner_lo66.end"
              attributeName="cx"
              dur="0.001s"
              values="20;4"
              fill="freeze"
            />
          </circle>
          <circle cx="4" cy="12" r="3" fill="white">
            <animate
              begin="0;spinner_z0Or.end"
              attributeName="cx"
              calcMode="spline"
              dur="0.5s"
              keySplines=".36,.6,.31,1"
              values="4;12"
              fill="freeze"
            />
            <animate
              begin="spinner_OLMs.end"
              attributeName="cx"
              calcMode="spline"
              dur="0.5s"
              keySplines=".36,.6,.31,1"
              values="12;20"
              fill="freeze"
            />
            <animate
              id="spinner_JsnR"
              begin="spinner_UHR2.end"
              attributeName="r"
              calcMode="spline"
              dur="0.5s"
              keySplines=".36,.6,.31,1"
              values="3;0"
              fill="freeze"
            />
            <animate
              id="spinner_Aguh"
              begin="spinner_JsnR.end"
              attributeName="cx"
              dur="0.001s"
              values="20;4"
              fill="freeze"
            />
            <animate
              begin="spinner_Aguh.end"
              attributeName="r"
              calcMode="spline"
              dur="0.5s"
              keySplines=".36,.6,.31,1"
              values="0;3"
              fill="freeze"
            />
          </circle>
          <circle cx="12" cy="12" r="3" fill="white">
            <animate
              begin="0;spinner_z0Or.end"
              attributeName="cx"
              calcMode="spline"
              dur="0.5s"
              keySplines=".36,.6,.31,1"
              values="12;20"
              fill="freeze"
            />
            <animate
              id="spinner_hSjk"
              begin="spinner_OLMs.end"
              attributeName="r"
              calcMode="spline"
              dur="0.5s"
              keySplines=".36,.6,.31,1"
              values="3;0"
              fill="freeze"
            />
            <animate
              id="spinner_UHR2"
              begin="spinner_hSjk.end"
              attributeName="cx"
              dur="0.001s"
              values="20;4"
              fill="freeze"
            />
            <animate
              begin="spinner_UHR2.end"
              attributeName="r"
              calcMode="spline"
              dur="0.5s"
              keySplines=".36,.6,.31,1"
              values="0;3"
              fill="freeze"
            />
            <animate
              begin="spinner_Aguh.end"
              attributeName="cx"
              calcMode="spline"
              dur="0.5s"
              keySplines=".36,.6,.31,1"
              values="4;12"
              fill="freeze"
            />
          </circle>
          <circle cx="20" cy="12" r="3" fill="white">
            <animate
              id="spinner_4v5M"
              begin="0;spinner_z0Or.end"
              attributeName="r"
              calcMode="spline"
              dur="0.5s"
              keySplines=".36,.6,.31,1"
              values="3;0"
              fill="freeze"
            />
            <animate
              id="spinner_OLMs"
              begin="spinner_4v5M.end"
              attributeName="cx"
              dur="0.001s"
              values="20;4"
              fill="freeze"
            />
            <animate
              begin="spinner_OLMs.end"
              attributeName="r"
              calcMode="spline"
              dur="0.5s"
              keySplines=".36,.6,.31,1"
              values="0;3"
              fill="freeze"
            />
            <animate
              begin="spinner_UHR2.end"
              attributeName="cx"
              calcMode="spline"
              dur="0.5s"
              keySplines=".36,.6,.31,1"
              values="4;12"
              fill="freeze"
            />
            <animate
              begin="spinner_Aguh.end"
              attributeName="cx"
              calcMode="spline"
              dur="0.5s"
              keySplines=".36,.6,.31,1"
              values="12;20"
              fill="freeze"
            />
          </circle>
        </svg>{' '}
        <>
          of{' '}
          <strong>
            {firstPageData?.totalResults
              ? firstPageData?.totalResults
              : 0}
          </strong>{' '}
          results
        </>
      </>
    )}
  </>
);
