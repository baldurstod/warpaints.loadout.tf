package server

type NotFoundError struct{}

func (e NotFoundError) Error() string {
	return "Not found"
}
