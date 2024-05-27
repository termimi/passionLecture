using VersOne.Epub;

namespace passionLecture;

public partial class Lecture : ContentPage
{
	public Lecture()
	{
		InitializeComponent();
	}
	public void setTextOfPage(string Page)
	{
		livreEnLecture.Text = Page;
	}
}