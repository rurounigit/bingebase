import { useState, useEffect } from 'react';
import { KEY } from './App';
import { StarRating } from './StarRating';
import { Loader } from './Loader';
import { ErrorMessage } from './ErrorMessage';
import { useKey } from '../hooks/useKey';
import { Button } from './Button';

export const MovieDetails = ({
  selectedID,
  onCloseMovie,
  onAddMovie,
  onDeleteMovie,
  watched,
}) => {
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [movie, setMovie] = useState({});
  const [plotIsShort, setPlotIsShort] = useState(true);

  const {
    Title: Title,
    Released: Released,
    Runtime: Runtime,
    Genre: Genre,
    Plot: Plot,
    Plotfull: Plotfull,
    imdbID: imdbID,
    imdbRating: imdbRating,
    Actors: Actors,
    Director: Director,
    Poster: Poster,
    Rated: Rated,
    Ratings: Ratings,
    imdbVotes: imdbVotes,
    Awards: Awards,
    Type: Type,
  } = movie;

  const savedRating = watched.find(
    (movie) => movie.imdbID === selectedID
  )?.userRating;

  const isWatched = watched.some(
    (watchedMovie) => watchedMovie.imdbID === movie.imdbID
  );

  const addDefaultImg = (e) => {
    e.target.src = 'default-poster.svg';
  };

  const rtRating = Number(Ratings?.[1]?.Value.replace(/%/g, ''));
  let rtState = null;
  if (rtRating >= 60) {
    rtState = 'positive';
  }
  if (rtRating < 60) {
    rtState = 'negative';
  }
  if (rtRating === 0) {
    rtState = null;
  }

  const handleSummary = () => {
    setPlotIsShort(!plotIsShort);
  };

  const getRottenTomatoesUrl = (movie) => {
    // Pass the whole movie object
    const formattedTitle = movie?.Title?.toLowerCase() // Optional chaining
      ?.replace(/[^a-z0-9 ]/g, '')
      ?.replace(/ /g, '_');

    const type = movie?.Type === 'movie' ? 'm' : 'tv'; // Determine type

    return formattedTitle
      ? `https://www.rottentomatoes.com/${type}/${formattedTitle}`
      : ''; // Return empty string if title is undefined
  };

  useKey('Escape', onCloseMovie);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setIsLoadingDetails(true);
        setDetailError('');
        let res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedID}`
        );

        if (!res || !res.ok)
          throw new Error("couldn't load movies details.");

        const data = await res.json();

        if (data.Response === 'False')
          throw new Error('no results found.');

        res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedID}&plot=full`
        );

        if (!res || !res.ok)
          throw new Error("couldn't load movies details.");

        const data2 = await res.json();

        if (data2.Response === 'False')
          throw new Error('no results found.');

        setMovie({ ...data, Plotfull: data2.Plot });
      } catch (err) {
        if (err.message === 'Failed to fetch') {
          setDetailError("couldn't load movie details.");
        } else {
          setDetailError(err.message);
        }
      } finally {
        setIsLoadingDetails(false);
      }
    };

    fetchMovieDetails();
  }, [selectedID]);

  useEffect(() => {
    if (!Title) return;
    document.title = `${Title} | ${
      savedRating ? '🌟' + savedRating : ''
    } ⭐️ ${imdbRating}`;
    return () => (document.title = 'BingeBase');
  }, [Title, savedRating, imdbRating, selectedID]);

  return (
    <div className="details">
      {isLoadingDetails ? (
        <Loader />
      ) : detailError ? (
        <ErrorMessage message={detailError} />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>

            <img
              src={Poster}
              alt={Title}
              onError={(e) => addDefaultImg(e)}
            />
            <div className="details-overview">
              <h2>{Title}</h2>
              <p>
                {Released} &bull; {Runtime} &bull;{' '}
                <span style={{ opacity: '0.3' }}>{Rated}</span>
              </p>
              <p>{Genre}</p>
              <p>
                <a
                  href={`https://www.imdb.com/title/${movie.imdbID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>⭐️</span> {imdbRating} IMDb rating{' '}
                  <span
                    style={{ opacity: '0.3' }}
                  >{`(${imdbVotes})`}</span>
                </a>
              </p>
              {movie ? (
                <a
                  href={getRottenTomatoesUrl(movie)} // Pass the movie object
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {rtState === 'positive' ? (
                    <svg
                      type="positive"
                      width="15px"
                      height="15px"
                      viewBox="0 0 90 90"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g transform="translate(1.33, 0)">
                        <g transform="translate(0, 16.27)">
                          <mask id="mask-2" fill="white">
                            <polygon points="0.000109100102 0.246970954 77.0827837 0.246970954 77.0827837 63.7145228 0.000109100102 63.7145228"></polygon>
                          </mask>
                          <path
                            d="M77.0137759,27.0426556 C76.2423237,14.6741909 69.9521992,5.42041494 60.4876349,0.246970954 C60.5414108,0.548381743 60.273195,0.925145228 59.9678008,0.791701245 C53.7772614,-1.91634855 43.2753527,6.84780083 35.9365975,2.25825726 C35.9917012,3.90539419 35.6700415,11.940249 24.3515353,12.4063071 C24.0843154,12.4172614 23.9372614,12.1443983 24.1062241,11.9512033 C25.619917,10.2247303 27.1482158,5.85360996 24.9507054,3.5233195 C20.2446473,7.74041494 17.5117012,9.32746888 8.48829876,7.23319502 C2.71103734,13.2740249 -0.562655602,21.5419087 0.08,31.8413278 C1.39120332,52.86639 21.0848133,64.8846473 40.9165145,63.6471369 C60.746888,62.4106224 78.3253112,48.0677178 77.0137759,27.0426556"
                            fill="#FA320A"
                            mask="url(#mask-2)"
                          ></path>
                        </g>
                        <path
                          d="M40.8717012,11.4648963 C44.946722,10.49361 56.6678838,11.3702905 60.4232365,16.3518672 C60.6486307,16.6506224 60.3312863,17.2159336 59.9678008,17.0572614 C53.7772614,14.3492116 43.2753527,23.113361 35.9365975,18.5238174 C35.9917012,20.1709544 35.6700415,28.2058091 24.3515353,28.6718672 C24.0843154,28.6828216 23.9372614,28.4099585 24.1062241,28.2167635 C25.619917,26.4902905 27.1478838,22.1191701 24.9507054,19.7888797 C19.8243983,24.3827386 17.0453112,25.8589212 5.91900415,22.8514523 C5.55485477,22.753195 5.67900415,22.1679668 6.06639004,22.020249 C8.16929461,21.2165975 12.933444,17.6965975 17.4406639,16.1450622 C18.2987552,15.8499585 19.1541909,15.6209129 19.9890456,15.4878008 C15.02639,15.0443154 12.7893776,14.3541909 9.63286307,14.8302075 C9.28697095,14.8823237 9.05195021,14.479668 9.26639004,14.2034855 C13.5193361,8.7253112 21.3540249,7.07087137 26.1878838,9.98107884 C23.2082988,6.28912863 20.8743568,3.34473029 20.8743568,3.34473029 L26.4046473,0.203485477 C26.4046473,0.203485477 28.6894606,5.30821577 30.3518672,9.02340249 C34.4657261,2.94506224 42.119834,2.38406639 45.3536929,6.69676349 C45.5455602,6.95302905 45.3450622,7.31751037 45.0247303,7.30987552 C42.3926971,7.24580913 40.9434025,9.63983402 40.833527,11.4605809 L40.8717012,11.4648963"
                          fill="#00912D"
                        ></path>
                      </g>
                    </svg>
                  ) : rtState === 'negative' ? (
                    <svg
                      type="negative"
                      width="15px"
                      height="15px"
                      viewBox="0 0 90 90"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g transform="translate(0, 1.23)">
                        <g>
                          <mask id="mask-2" fill="white">
                            <polygon points="0 0.161950465 79.7417075 0.161950465 79.7417075 77.522807 0 77.522807"></polygon>
                          </mask>
                          <path
                            d="M71.4638596,70.225614 C56.3459649,71.0192982 53.2568421,53.7203509 47.325614,53.8435088 C44.7982456,53.8964912 42.8063158,56.5389474 43.6810526,59.6185965 C44.1621053,61.3115789 45.4964912,63.794386 46.337193,65.3350877 C49.302807,70.7719298 44.9185965,76.9245614 39.7880702,77.4449123 C31.2621053,78.3098246 27.705614,73.3638596 27.925614,68.3007018 C28.1729825,62.6168421 32.9922807,56.8091228 28.0494737,54.3378947 C22.8694737,51.7480702 18.6585965,61.8754386 13.7017544,64.1357895 C9.2154386,66.1817544 2.9877193,64.5954386 0.773684211,59.6136842 C-0.781403509,56.1129825 -0.498596491,49.3722807 6.42526316,46.8003509 C10.7501754,45.1940351 20.3880702,48.9010526 20.8824561,44.205614 C21.4522807,38.7929825 10.7575439,38.3364912 7.53754386,37.0385965 C1.84,34.7424561 -1.52280702,29.8291228 1.11192982,24.5582456 C3.08877193,20.6045614 8.90526316,18.9957895 13.3449123,20.7277193 C18.6635088,22.8024561 19.517193,28.3189474 22.2421053,30.6129825 C24.5894737,32.5901754 27.8021053,32.8375439 29.9031579,31.4782456 C31.4526316,30.4754386 31.9684211,28.2729825 31.3838596,26.2610526 C30.6084211,23.5901754 28.5505263,21.9235088 26.542807,20.2905263 C22.9698246,17.3859649 17.925614,14.8884211 20.9768421,6.96035088 C23.4778947,0.463157895 30.8133333,0.229122807 30.8133333,0.229122807 C33.7277193,-0.0985964912 36.3375439,0.781403509 38.4642105,2.68140351 C41.3073684,5.22140351 41.8610526,8.61649123 41.3852632,12.2385965 C40.9505263,15.5449123 39.7803509,18.4407018 39.1701754,21.7164912 C38.4621053,25.5196491 40.4947368,29.3519298 44.3603509,29.5010526 C49.4449123,29.6975439 50.9694737,25.7894737 51.5915789,23.3122807 C52.5024561,19.6877193 53.6978947,16.322807 57.0617544,14.2035088 C61.8894737,11.1617544 68.5954386,11.8284211 71.7066667,17.674386 C74.1677193,22.3 73.3775439,28.6677193 69.6024561,32.1449123 C67.9087719,33.7045614 65.8722807,34.254386 63.6694737,34.2698246 C60.5105263,34.2922807 57.3529825,34.2147368 54.4207018,35.6929825 C52.4245614,36.6989474 51.5547368,38.3382456 51.5550877,40.5354386 C51.5550877,42.6768421 52.6698246,44.0754386 54.4761404,44.985614 C57.8782456,46.7003509 61.6336842,47.0508772 65.3087719,47.694386 C70.6382456,48.6277193 75.3242105,50.5049123 78.3326316,55.4505263 C78.3596491,55.4940351 78.3859649,55.5378947 78.4115789,55.5821053 C81.8666667,61.4375439 78.2533333,69.8687719 71.4638596,70.225614"
                            fill="#0AC855"
                            mask="url(#mask-2)"
                          ></path>
                        </g>
                      </g>
                    </svg>
                  ) : null}
                  {Ratings?.[1]?.Value}
                </a>
              ) : null}

              <p style={{ opacity: '0.3' }}>{Awards}</p>
            </div>
          </header>
          <section>
            <div className="rating">
              <StarRating
                maxRating={10}
                size={24}
                onSetRating={onAddMovie}
                key={imdbID}
                rating={savedRating}
                movie={movie}
              />
              {isWatched ? null : (
                <button
                  className="btn-add"
                  onClick={() => onAddMovie(savedRating, movie)}
                >
                  + Add to list
                </button>
              )}
            </div>
            <p>
              {plotIsShort ? (
                <>
                  <em>{Plot}</em>
                  <Button
                    className="btn-more"
                    onClick={handleSummary}
                  >
                    ...more
                  </Button>
                </>
              ) : (
                <>
                  <em>{Plotfull}</em>
                  <Button
                    className="btn-more"
                    onClick={handleSummary}
                  >
                    ...less
                  </Button>
                </>
              )}
            </p>

            <p>Starring {Actors}</p>
            <p>Directed by {Director}</p>
          </section>
        </>
      )}
    </div>
  );
};
