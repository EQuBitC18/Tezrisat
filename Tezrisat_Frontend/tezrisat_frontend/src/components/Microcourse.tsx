
// @ts-expect-error
function Microcourse({ microcourse }) {
    return (
        <div className="microcourse-container">
            <p className="microcourse-title">{microcourse.title}</p>
        </div>
    );
}

export default Microcourse;
